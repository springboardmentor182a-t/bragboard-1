from pydantic import BaseModel
from typing import Dict

class ReactionCreate(BaseModel):
    shoutout_type: str
    shoutout_id: int
    user_id: int | None = None
    reaction_type: str

class ReactionCount(BaseModel):
    shoutout_type: str
    shoutout_id: int
    counts: Dict[str, int]
