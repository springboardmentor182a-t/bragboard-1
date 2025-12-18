from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import csv
import io

from src.database import get_db
from src.auth.auth import admin_required
from src.utils.jwt_handler import TokenData
from src.models.report import Report

router = APIRouter(
    prefix="/admin/export",
    tags=["Export Reports"]
)

@router.get("/reports")
def export_reports(
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(admin_required),
):
    """
    Admin: Export all reports as CSV
    """
    reports = db.query(Report).all()

    buffer = io.StringIO()
    writer = csv.writer(buffer)

    # CSV Header
    writer.writerow([
        "Report ID",
        "Shoutout ID",
        "Reported By",
        "Reason",
        "Status",
        "Created At",
        "Resolved At",
        "Resolved By"
    ])

    # CSV Rows
    for r in reports:
        writer.writerow([
            r.id,
            r.shoutout_id,
            r.reported_by,
            r.reason,
            r.status,
            r.created_at,
            r.resolved_at,
            r.resolved_by
        ])

    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=reports.csv"
        }
    )
