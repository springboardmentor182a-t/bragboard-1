"""Todos/Shoutouts service layer."""
from typing import List, Optional

# Mock database for shoutouts
mock_shoutouts = [
    {"id": 1, "author": "John Doe", "content": "Great job!", "status": "Pending"},
    {"id": 2, "author": "Jane Smith", "content": "Amazing work!", "status": "Approved"},
]

# Mock database for flagged content
mock_flagged = [
    {"id": 1, "content": "Suspicious activity", "reporter": "John", "reason": "Spam", "severity": "High"},
    {"id": 2, "content": "Inappropriate language", "reporter": "Jane", "reason": "Inappropriate", "severity": "Medium"},
]


async def get_all_shoutouts(status: Optional[str] = None) -> List[dict]:
    """
    Get all shout-outs, optionally filtered by status.
    
    Args:
        status: Optional status filter
        
    Returns:
        List of shoutouts
    """
    if status:
        return [s for s in mock_shoutouts if s["status"] == status]
    return mock_shoutouts


async def approve_shoutout(shoutout_id: int) -> dict:
    """
    Approve a shout-out.
    
    Args:
        shoutout_id: Shoutout ID
        
    Returns:
        Success message
    """
    return {"message": "Shout-out approved", "id": shoutout_id}


async def reject_shoutout(shoutout_id: int) -> dict:
    """
    Reject a shout-out.
    
    Args:
        shoutout_id: Shoutout ID
        
    Returns:
        Success message
    """
    return {"message": "Shout-out rejected", "id": shoutout_id}


async def get_flagged_content() -> List[dict]:
    """Get all flagged content."""
    return mock_flagged


async def resolve_flagged_content(item_id: int, action: str) -> dict:
    """
    Resolve flagged content.
    
    Args:
        item_id: Flagged item ID
        action: Action to take
        
    Returns:
        Success message
    """
    return {"message": f"Flagged content {action}", "id": item_id}


async def get_analytics_overview() -> dict:
    """Get analytics overview."""
    return {
        "total_users": 2543,
        "total_shoutouts": 8234,
        "flagged_content": 23,
        "engagement_rate": 94.2
    }


async def get_user_growth() -> dict:
    """Get user growth data."""
    return {
        "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        "data": [100, 250, 400, 800, 1500, 2543]
    }


async def get_engagement_metrics() -> dict:
    """Get engagement metrics."""
    return {
        "daily_active_users": 1234,
        "average_session_time": "8m 42s",
        "posts_per_day": 156
    }
