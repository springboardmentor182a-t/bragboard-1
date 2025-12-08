# src/reports_controller.py
from fastapi import APIRouter, HTTPException, Body, Query
from typing import List, Optional
from src.entities_report import Report
from src.database import SessionLocal
from datetime import datetime
from pydantic import BaseModel

router = APIRouter(prefix="/reports", tags=["reports"])

# -------------------------------
# Schemas
# -------------------------------
class ReportCreateRequest(BaseModel):
    shoutout_id: int
    reason: str

class ReportResponse(BaseModel):
    id: int
    shoutout_id: int
    reported_by: int
    reason: str
    status: Optional[str] = "PENDING"
    reported_at: Optional[datetime] = datetime.utcnow()
    resolved_by: Optional[int] = None
    resolved_at: Optional[datetime] = None

    model_config = {"from_attributes": True}

class ReportResolveRequest(BaseModel):
    report_id: int
    action: str  # "RESOLVE" or "REJECT"
    admin_id: int

# -------------------------------
# Routes
# -------------------------------

# Employee: report a shoutout
@router.post("/", response_model=ReportResponse)
def report_shoutout(request: ReportCreateRequest, reported_by: int = Body(...)):
    db = SessionLocal()
    report = Report(
        shoutout_id=request.shoutout_id,
        reason=request.reason,
        reported_by=reported_by
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    db.close()
    return report

# Employee: view their reports
@router.get("/my-reports", response_model=List[ReportResponse])
def get_my_reports(employee_id: int = Query(..., description="Employee ID")):
    db = SessionLocal()
    reports = db.query(Report).filter(Report.reported_by == employee_id).all()
    db.close()
    return reports

# Admin: view all reports
@router.get("/admin", response_model=List[ReportResponse])
def get_all_reports():
    db = SessionLocal()

    # -------------------- Insert test reports if table empty --------------------
    if db.query(Report).count() == 0:
        test_reports = [
            Report(shoutout_id=101, reported_by=1, reason="Inappropriate content", status="PENDING", reported_at=datetime.utcnow()),
            Report(shoutout_id=102, reported_by=2, reason="Spam", status="PENDING", reported_at=datetime.utcnow()),
            Report(shoutout_id=103, reported_by=3, reason="Duplicate shoutout", status="PENDING", reported_at=datetime.utcnow()),
        ]
        for tr in test_reports:
            db.add(tr)
        db.commit()

    # -------------------- Fetch all reports --------------------
    reports = db.query(Report).all()
    print("DEBUG: fetched reports ->", reports)  # optional debug
    db.close()
    return reports

# Admin: resolve a report
@router.post("/admin/resolve", response_model=ReportResponse)
def resolve_report(request: ReportResolveRequest):
    db = SessionLocal()
    report = db.query(Report).filter(Report.id == request.report_id).first()
    if not report:
        db.close()
        raise HTTPException(status_code=404, detail="Report not found")

    if request.action.upper() == "RESOLVE":
        report.status = "RESOLVED"
    elif request.action.upper() == "REJECT":
        report.status = "REJECTED"
    else:
        db.close()
        raise HTTPException(status_code=400, detail="Invalid action")

    report.resolved_by = request.admin_id
    report.resolved_at = datetime.utcnow()
    db.commit()
    db.refresh(report)
    db.close()
    return report
