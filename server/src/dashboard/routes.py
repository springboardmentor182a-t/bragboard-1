print("✅ dashboards.routes LOADED")

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.database import get_db
from src.shoutouts.models import Shoutout
from src.leaderboard.models import Leaderboard
from . import service

router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"]
)


@router.get("/admin")
def admin_dashboard(db: Session = Depends(get_db)):
    try:
        stats = service.get_admin_dashboard_stats(db)
        recent_shoutouts = service.get_recent_shoutouts(db, limit=5)

        return {
            "stats": stats,
            "recent_shoutouts": [
                {
                    "id": s.id,
                    "message": s.message,
                    "created_at": s.created_at.isoformat() if s.created_at else None,
                    "sender_id": s.sender_id,
                    "receiver_id": s.receiver_id
                }
                for s in recent_shoutouts
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/employee/{employee_id}")
def employee_dashboard(employee_id: int, db: Session = Depends(get_db)):
    try:
        received_shoutouts = db.query(Shoutout).filter(
            Shoutout.receiver_id == employee_id
        ).count()

        sent_shoutouts = db.query(Shoutout).filter(
            Shoutout.sender_id == employee_id
        ).count()

        leaderboard_entry = db.query(Leaderboard).filter(
            Leaderboard.employee_id == employee_id
        ).first()

        recent_received = db.query(Shoutout).filter(
            Shoutout.receiver_id == employee_id
        ).order_by(Shoutout.created_at.desc()).limit(5).all()

        return {
            "employee_id": employee_id,
            "received_shoutouts": received_shoutouts,
            "sent_shoutouts": sent_shoutouts,
            "leaderboard_score": leaderboard_entry.score if leaderboard_entry else 0,
            "leaderboard_rank": leaderboard_entry.rank if leaderboard_entry else None,
            "recent_shoutouts": [
                {
                    "id": s.id,
                    "message": s.message,
                    "created_at": s.created_at.isoformat() if s.created_at else None,
                    "sender_id": s.sender_id
                }
                for s in recent_received
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
