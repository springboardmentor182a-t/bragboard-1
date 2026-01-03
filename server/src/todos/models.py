"""Pydantic models for todos/shoutouts."""
from pydantic import BaseModel
from typing import Optional


class ShoutOut(BaseModel):
    """ShoutOut model."""
    id: int
    author: str
    content: str
    status: str


class FlaggedItem(BaseModel):
    """Flagged content model."""
    id: int
    content: str
    reporter: str
    reason: str
    severity: str
