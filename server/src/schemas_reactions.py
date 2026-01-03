from pydantic import BaseModel, Field
from typing import Literal


class ReactionCreate(BaseModel):
    type: Literal["like", "clap", "star"] = Field(..., description="Reaction type")


class ReactionCounts(BaseModel):
    like: int = 0
    clap: int = 0
    star: int = 0


class ReactionResponse(BaseModel):
    message: str
    counts: ReactionCounts
