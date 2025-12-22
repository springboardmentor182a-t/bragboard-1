from fastapi import APIRouter
from fastapi.responses import FileResponse
from app.services.export_service import export_csv, export_pdf

router = APIRouter()

@router.get("/export/csv")
def export_reports_csv():
    file_path = export_csv()
    return FileResponse(
        file_path,
        media_type="text/csv",
        filename="shoutouts_report.csv"
    )

@router.get("/export/pdf")
def export_reports_pdf():
    file_path = export_pdf()
    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename="shoutouts_report.pdf"
    )
