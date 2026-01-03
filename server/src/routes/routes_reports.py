from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.database import get_db
from src.schemas.schemas_reports import ReportCreate, ReportResponse
from src.service.report_service import create_report, get_my_reports
from src.auth.dependencies import get_current_user

router = APIRouter(prefix="/reports", tags=["Reports - Employee"])

@router.post("/", response_model=ReportResponse)
def report_shoutout(data: ReportCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return create_report(db, data, current_user.id)


@router.get("/my", response_model=list[ReportResponse])
def my_reports(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return get_my_reports(db, current_user.id)
