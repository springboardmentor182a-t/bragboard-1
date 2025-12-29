from pydantic import BaseModel

class LeaderboardResponse(BaseModel):
    rank: int
    user_id: int
    name: str
    department: str
    points: int
