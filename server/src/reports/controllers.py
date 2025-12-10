from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.database.dependencies import get_db
from src.auth.dependencies import get_current_user, get_current_admin  # adjust names
from src.reports import schemas, services

router = APIRouter(prefix="/reports", tags=["Reports"])
 
# 1) EMPLOYEE: report a shoutout
@router.post("/shoutout/{shoutout_id}", response_model=schemas.ReportDetail)
def report_shoutout(
    shoutout_id: int,
    data: schemas.ReportCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    report = services.create_report(db, user_id=current_user.id, shoutout_id=shoutout_id, data=data)
    return report

# 2) EMPLOYEE: view own reports
@router.get("/me", response_model=list[schemas.ReportDetail])
def get_my_reports(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    reports = services.list_reports_for_user(db, user_id=current_user.id)
    return reports

# 3) ADMIN: list all reports (optionally by status)
@router.get("/", response_model=list[schemas.ReportDetail])
def get_all_reports(
    status: str | None = None,
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin),
):
    reports = services.list_reports_for_admin(db, status=status)
    return reports

# 4) ADMIN: resolve a report
@router.patch("/{report_id}/resolve", response_model=schemas.ReportDetail)
def resolve_report(
    report_id: int,
    data: schemas.ReportResolve,
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin),
):
    report = services.resolve_report(db, admin_id=admin.id, report_id=report_id, data=data)
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
    return report
