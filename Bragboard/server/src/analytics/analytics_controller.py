from fastapi import APIRouter, Depends
from .analytics_service import AnalyticsService
router = APIRouter(prefix="/analytics", tags=["Analytics"])
@router.get("/overview")
def get_overview(service: AnalyticsService = Depends()):
    return service.overview()
@router.get("/top-contributors")
def top_contributors(limit: int = 5, service: AnalyticsService = Depends()):
    return service.top_senders(limit)
@router.get("/most-tagged")
def most_tagged(limit: int = 5, service: AnalyticsService = Depends()):
    return service.most_tagged(limit)
@router.get("/reaction-stats")
def reaction_stats(service: AnalyticsService = Depends()):
    return service.reaction_counts()
@router.get("/engagement-trend")
def engagement_trend(days: int = 30, service: AnalyticsService = Depends()):
    return service.engagement_trend(days)
@router.get("/department-stats")
def department_stats(service: AnalyticsService = Depends()):
    return service.department_stats()
