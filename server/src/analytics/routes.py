# src/analytics/routes.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database.core import get_db
from entities.analytics import Employee, Department  # change to your paths
from shoutouts.models import Shoutout

router = APIRouter(
    prefix="/admin/dashboard",
    tags=["admin-dashboard"],
)


@router.get("/overview")
def get_overview(db: Session = Depends(get_db)):
    total_employees = db.query(func.count(Employee.id)).scalar()
    total_shoutouts = db.query(func.count(Shoutout.id)).scalar()
    total_departments = db.query(func.count(Department.id)).scalar()

    return {
        "total_employees": total_employees,
        "total_shoutouts": total_shoutouts,
        "total_departments": total_departments,
    }


@router.get("/top-contributors")
def get_top_contributors(limit: int = 5, db: Session = Depends(get_db)):
    rows = (
        db.query(
            Shoutout.sender_id.label("employee_id"),
            func.count(Shoutout.id).label("shoutout_count"),
        )
        .group_by(Shoutout.sender_id)
        .order_by(func.count(Shoutout.id).desc())
        .limit(limit)
        .all()
    )

    return [
        {
            "employee_id": r.employee_id,
            "shoutout_count": r.shoutout_count,
        }
        for r in rows
    ]


@router.get("/most-tagged")
def get_most_tagged(limit: int = 5, db: Session = Depends(get_db)):
    rows = (
        db.query(
            Shoutout.receiver_id.label("employee_id"),
            func.count(Shoutout.id).label("tagged_count"),
        )
        .group_by(Shoutout.receiver_id)
        .order_by(func.count(Shoutout.id).desc())
        .limit(limit)
        .all()
    )

    return [
        {
            "employee_id": r.employee_id,
            "tagged_count": r.tagged_count,
        }
        for r in rows
    ]


@router.get("/department-stats")
def get_department_stats(db: Session = Depends(get_db)):
    rows = (
        db.query(
            Department.id.label("department_id"),
            Department.name.label("department_name"),
            func.count(Shoutout.id).label("shoutout_count"),
        )
        .join(Employee, Employee.department_id == Department.id)
        .join(Shoutout, Shoutout.receiver_id == Employee.id)
        .group_by(Department.id, Department.name)
        .all()
    )

    return [
        {
            "department_id": r.department_id,
            "department_name": r.department_name,
            "shoutout_count": r.shoutout_count,
        }
        for r in rows
    ]
