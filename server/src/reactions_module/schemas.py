from pydantic import BaseModel
from typing import Dict

class ReactionCreate(BaseModel):
    parent_type: str
    parent_id: int
    user_id: int | None = None
    reaction_type: str

class ReactionCount(BaseModel):
    parent_type: str
    parent_id: int
    counts: Dict[str, int]
