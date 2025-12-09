from sqlalchemy.orm import Session
from datetime import datetime

from models.report import Report


class ReportService:

    @staticmethod
    def create_report(db: Session, shoutout_id: int, reason: str, user_id: int) -> Report:
        report = Report(
            shoutout_id=shoutout_id,
            reported_by=user_id,
            reason=reason,
            status="pending"
        )
        db.add(report)
        db.commit()
        db.refresh(report)
        return report

    @staticmethod
    def get_user_reports(db: Session, user_id: int):
        return (
            db.query(Report)
            .filter(Report.reported_by == user_id)
            .order_by(Report.created_at.desc())
            .all()
        )

    @staticmethod
    def get_all_reports(db: Session, status: str | None = None):
        query = db.query(Report)
        if status:
            query = query.filter(Report.status == status)
        return query.order_by(Report.created_at.desc()).all()

    @staticmethod
    def resolve_report(
        db: Session,
        report_id: int,
        admin_id: int,
        admin_notes: str | None = None,
    ):
        report = db.query(Report).filter(Report.id == report_id).first()
        if not report:
            return None

        report.status = "resolved"
        report.resolved_at = datetime.utcnow()
        report.resolved_by = admin_id
        if admin_notes is not None:
            report.admin_notes = admin_notes

        db.commit()
        db.refresh(report)
        return report
