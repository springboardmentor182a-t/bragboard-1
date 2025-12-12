from sqlalchemy.orm import Session
from datetime import datetime

from src.reports import models, schemas
from src.reports.enums import ReportStatus, ReportAction
from src.admin_logs.models import AdminLog  
from src.shoutouts.models import Shoutout

def create_report(db: Session, *, user_id: int, shoutout_id: int, data: schemas.ReportCreate):
    
    existing = db.query(models.Report).filter(
        models.Report.shoutout_id == shoutout_id,
        models.Report.reported_by == user_id,
        models.Report.status == ReportStatus.OPEN,
    ).first()

    if existing:
        return existing

    report = models.Report(
        shoutout_id=shoutout_id,
        reported_by=user_id,
        reason=data.reason,
        status=ReportStatus.OPEN,
    )

    db.add(report)
    db.commit()
    db.refresh(report)
    return report


def list_reports_for_user(db: Session, *, user_id: int):
    return db.query(models.Report).filter(
        models.Report.reported_by == user_id
    ).order_by(models.Report.created_at.desc()).all()


def list_reports_for_admin(db: Session, *, status: ReportStatus | None = None):
    q = db.query(models.Report)
    if status:
        q = q.filter(models.Report.status == status)
    return q.order_by(models.Report.created_at.desc()).all()


def resolve_report(db: Session, *, admin_id: int, report_id: int, data: schemas.ReportResolve):
    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not report:
        return None  

    # update status
    report.status = ReportStatus.RESOLVED
    report.resolved_at = datetime.utcnow()
    report.resolved_by = admin_id

    if data.action == ReportAction.REMOVE_SHOUTOUT:
        shoutout = db.query(Shoutout).filter(Shoutout.id == report.shoutout_id).first()
        if shoutout:
            shoutout.is_deleted = True
            db.add(shoutout)
            db.commit()

    log = AdminLog(
        admin_id=admin_id,
        action=f"Resolved report #{report.id} ({data.action})",
        target_id=report.shoutout_id,
        target_type="shoutout",
        timestamp=datetime.utcnow(),
    )
    db.add(log)

    db.commit()
    db.refresh(report)
    return report
