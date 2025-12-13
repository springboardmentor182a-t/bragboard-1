from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.database import get_db
from src.schemas.schemas_reports import ReportListAdmin
from src.service.report_service import get_all_reports, resolve_report
from src.auth.dependencies import get_current_admin

router = APIRouter(prefix="/admin/reports", tags=["Reports - Admin"])

@router.get("/", response_model=list[ReportListAdmin])
def admin_get_all_reports(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return get_all_reports(db)


@router.put("/{report_id}/resolve", response_model=ReportListAdmin)
def admin_resolve(report_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    result = resolve_report(db, report_id, admin.id)
    if not result:
        raise HTTPException(status_code=404, detail="Report not found")
    return result
