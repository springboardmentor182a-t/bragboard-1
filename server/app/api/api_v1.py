from fastapi import APIRouter
from app.api.endpoints import shoutouts, reports

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(shoutouts.router, prefix="/shoutouts", tags=["Shoutouts"])
api_router.include_router(reports.router, prefix="/reports", tags=["Reports"])
