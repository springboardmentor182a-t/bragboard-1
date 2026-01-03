"""Todos/Shoutouts controller (routes)."""
from fastapi import APIRouter
from typing import List, Optional
from .models import ShoutOut, FlaggedItem
from .service import (
    get_all_shoutouts,
    approve_shoutout,
    reject_shoutout,
    get_flagged_content,
    resolve_flagged_content,
    get_analytics_overview,
    get_user_growth,
    get_engagement_metrics
)

router = APIRouter(tags=["Shoutouts & Analytics"])


# Shout-out Moderation Routes
@router.get("/api/shoutouts", response_model=List[ShoutOut])
async def get_shoutouts(status: Optional[str] = None):
    """Get all shout-outs, optionally filtered by status."""
    return await get_all_shoutouts(status)


@router.put("/api/shoutouts/{shoutout_id}/approve")
async def approve_shoutout_route(shoutout_id: int):
    """Approve a shout-out."""
    return await approve_shoutout(shoutout_id)


@router.put("/api/shoutouts/{shoutout_id}/reject")
async def reject_shoutout_route(shoutout_id: int):
    """Reject a shout-out."""
    return await reject_shoutout(shoutout_id)


# Flagged Content Routes
@router.get("/api/flagged")
async def get_flagged():
    """Get all flagged content."""
    return await get_flagged_content()


@router.put("/api/flagged/{item_id}/resolve")
async def resolve_flagged(item_id: int, action: str):
    """Resolve flagged content."""
    return await resolve_flagged_content(item_id, action)


# Analytics Routes
@router.get("/api/analytics/overview")
async def analytics_overview():
    """Get analytics overview."""
    return await get_analytics_overview()


@router.get("/api/analytics/user-growth")
async def user_growth():
    """Get user growth data."""
    return await get_user_growth()


@router.get("/api/analytics/engagement")
async def engagement_metrics():
    """Get engagement metrics."""
    return await get_engagement_metrics()
