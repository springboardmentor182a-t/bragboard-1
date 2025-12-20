from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class LeaderboardBase(BaseModel):
    name: str
    email: Optional[str] = None
    points: int = 0
    attempts: int = 0
    level: str = "Bronze"

class LeaderboardCreate(LeaderboardBase):
    pass

class LeaderboardUpdate(LeaderboardBase):
    pass

class LeaderboardOut(LeaderboardBase):
    id: int
    last_active: datetime
    rank: int

    class Config:
        orm_mode = True
