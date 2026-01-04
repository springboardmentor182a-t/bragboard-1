from fastapi import APIRouter, Query
from src.database import SessionLocal
from src.entities_report import Report
from src.entities.shoutout import ShoutOut
from src.entities.user import User   

router = APIRouter(prefix="/dashboard", tags=["dashboard"])



@router.get("/employee")
def employee_dashboard(employee_id: int = Query(...)):
    db = SessionLocal()

    total_shoutouts = (
        db.query(ShoutOut)
        .filter(ShoutOut.author_id == employee_id)
        .count()
    )

    total_reports = (
        db.query(Report)
        .filter(Report.reported_by == employee_id)
        .count()
    )

    pending_reports = (
        db.query(Report)
        .filter(
            Report.reported_by == employee_id,
            Report.status == "PENDING"
        )
        .count()
    )

    db.close()

    return {
        "total_shoutouts": total_shoutouts,
        "total_reports": total_reports,
        "pending_reports": pending_reports
    }



@router.get("/admin")
def admin_dashboard():
    db = SessionLocal()

    total_employees = (
        db.query(User)
        .filter(User.role == "employee")
        .count()
    )

    total_shoutouts = db.query(ShoutOut).count()

    total_reports = db.query(Report).count()

    pending_reports = (
        db.query(Report)
        .filter(Report.status == "PENDING")
        .count()
    )

    db.close()

    return {
        "total_employees": total_employees,
        "total_shoutouts": total_shoutouts,
        "total_reports": total_reports,
        "pending_reports": pending_reports
    }
