from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class LeaderboardEntry(BaseModel):
    user_id: int
    name: str
    department: str
    score: int
    rank: int
    shoutouts_received: int
    shoutouts_sent: int
    total_reactions: int
    avatar_color: str

class DepartmentStats(BaseModel):
    department: str
    total_shoutouts: int
    most_active_user: str
    engagement_score: float

class TimeRange(BaseModel):
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    range_type: str = "weekly"  # weekly, monthly, all_time