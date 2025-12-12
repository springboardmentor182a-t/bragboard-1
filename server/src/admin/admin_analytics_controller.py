# server/src/admin/admin_analytics_controller.py
from fastapi import APIRouter
from sqlalchemy import func
from src.database import SessionLocal
from src.entities_user import User
from src.entities.shoutout import ShoutOut     
from src.entities_report import Report
from src.entities.comment import Comment

router = APIRouter(prefix="/admin", tags=["admin-analytics"])

@router.get("/analytics")
def get_admin_analytics():
    db = SessionLocal()

    total_users = db.query(User).count()
    total_shoutouts = db.query(ShoutOut).count()  
    total_reports = db.query(Report).count()
    pending_reports = db.query(Report).filter(Report.status == "PENDING").count()
    resolved_reports = db.query(Report).filter(Report.status == "RESOLVED").count()
    total_comments = db.query(Comment).count()

    # Top employees by shoutouts created
    top_employees = (
        db.query(ShoutOut.author_id, func.count(ShoutOut.id).label("count"))
        .group_by(ShoutOut.author_id)
        .order_by(func.count(ShoutOut.id).desc())
        .limit(5)
        .all()
    )

    db.close()

    return {
        "total_users": total_users,
        "total_shoutouts": total_shoutouts,
        "total_reports": total_reports,
        "pending_reports": pending_reports,
        "resolved_reports": resolved_reports,
        "total_comments": total_comments,
        "top_employees": [
            {"employee_id": emp[0], "shoutout_count": emp[1]}
            for emp in top_employees
        ]
    }
