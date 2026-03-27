from sqlalchemy.orm import Session
from datetime import datetime

from src.entities.report import Report
from src.schemas.schemas_reports import ReportCreate

def create_report(db: Session, data: ReportCreate, user_id: int):
    new_report = Report(
        shoutout_id=data.shoutout_id,
        reported_by=user_id,
        reason=data.reason,
        status="PENDING"
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return new_report


def get_my_reports(db: Session, user_id: int):
    return db.query(Report).filter(Report.reported_by == user_id).all()


def get_all_reports(db: Session):
    return db.query(Report).order_by(Report.reported_at.desc()).all()


def resolve_report(db: Session, report_id: int, admin_id: int):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        return None
    
    report.status = "RESOLVED"
    report.resolved_by = admin_id
    report.resolved_at = datetime.utcnow()

    db.commit()
    db.refresh(report)
    return report
