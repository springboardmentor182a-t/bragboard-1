from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.database import get_db
from src.schemas.report_schema import ReportCreate, ResolveReport, ReportOut
from src.services.report_service import ReportService
from src.auth import employee_required, admin_required
from src.utils.jwt_handler import TokenData

router = APIRouter(prefix="/reports", tags=["Reports"])


# -------------------------
# EMPLOYEE APIs
# -------------------------

@router.post(
    "/",
    summary="Employee: Report a shoutout",
    response_model=dict,
)
def report_shoutout(
    data: ReportCreate,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(employee_required),
):
    """
    Employee reports a shoutout with a reason.
    """
    report = ReportService.create_report(
        db=db,
        shoutout_id=data.shoutout_id,
        reason=data.reason,
        user_id=current_user.id,
    )
    return {"message": "Report submitted", "report_id": report.id}


@router.get(
    "/my",
    summary="Employee: View my reported shoutouts",
    response_model=list[ReportOut],
)
def my_reports(
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(employee_required),
):
    """
    Employee can see only his/her own reports.
    """
    reports = ReportService.get_user_reports(db, current_user.id)
    return reports


# -------------------------
# ADMIN APIs
# -------------------------

@router.get(
    "/admin",
    summary="Admin: View all reports",
    response_model=list[ReportOut],
)
def all_reports(
    status: str | None = None,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(admin_required),
):
    """
    Admin can see all reports. Filter by status if provided.
    Example: /reports/admin?status=pending
    """
    reports = ReportService.get_all_reports(db, status=status)
    return reports


@router.put(
    "/admin/{report_id}/resolve",
    summary="Admin: Resolve a report",
    response_model=dict,
)
def resolve_report(
    report_id: int,
    data: ResolveReport,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(admin_required),
):
    """
    Admin resolves a report. Optionally adds admin_notes.
    """
    report = ReportService.resolve_report(
        db=db,
        report_id=report_id,
        admin_id=current_user.id,
        admin_notes=data.admin_notes,
    )
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    return {"message": "Report resolved", "report_id": report.id}
