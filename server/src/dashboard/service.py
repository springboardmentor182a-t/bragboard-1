from sqlalchemy.orm import Session
from src.shoutouts.models import Shoutout
from src.leaderboard.models import Leaderboard


def get_admin_dashboard_stats(db: Session):
    total_shoutouts = db.query(Shoutout).count()
    leaderboard_entries = db.query(Leaderboard).count()

    return {
        "total_shoutouts": total_shoutouts,
        "leaderboard_entries": leaderboard_entries
    }


def get_recent_shoutouts(db: Session, limit: int = 5):
    return (
        db.query(Shoutout)
        .order_by(Shoutout.created_at.desc())
        .limit(limit)
        .all()
    )


def get_employee_stats(db: Session, employee_id: int):
    received_count = db.query(Shoutout).filter(
        Shoutout.receiver_id == employee_id
    ).count()

    sent_count = db.query(Shoutout).filter(
        Shoutout.sender_id == employee_id
    ).count()

    leaderboard = db.query(Leaderboard).filter(
        Leaderboard.employee_id == employee_id
    ).first()

    return {
        "received_shoutouts": received_count,
        "sent_shoutouts": sent_count,
        "leaderboard_score": leaderboard.score if leaderboard else 0,
        "leaderboard_rank": leaderboard.rank if leaderboard else None
    }
