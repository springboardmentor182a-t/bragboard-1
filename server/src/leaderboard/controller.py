from fastapi import APIRouter, HTTPException
from typing import List, Dict
from .service import leaderboard_service
from .models import LeaderboardEntry, DepartmentStats

router = APIRouter(prefix="/leaderboard", tags=["Leaderboard"])

@router.get("/top-performers", response_model=List[LeaderboardEntry])
async def get_top_performers(range_type: str = "weekly"):
    """
    Get top performing employees based on recognition
    range_type: weekly, monthly, all_time
    """
    try:
        leaderboard = leaderboard_service.get_leaderboard(range_type)
        return leaderboard
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/department-stats", response_model=List[DepartmentStats])
async def get_department_statistics():
    """Get statistics by department"""
    try:
        stats = leaderboard_service.get_department_stats()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/recent-highlights")
async def get_recent_highlights():
    """Get recent recognition highlights"""
    try:
        highlights = leaderboard_service.get_recent_highlights()
        return highlights
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user/{user_id}/stats")
async def get_user_stats(user_id: int):
    """Get detailed stats for a specific user"""
    try:
        leaderboard = leaderboard_service.get_leaderboard("all_time")
        user_stats = next((u for u in leaderboard if u["user_id"] == user_id), None)
        
        if not user_stats:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Add additional user insights
        user_stats["performance_trend"] = "up" if user_stats["rank"] <= 3 else "stable"
        user_stats["engagement_level"] = "high" if user_stats["score"] > 100 else "medium"
        
        return user_stats
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))