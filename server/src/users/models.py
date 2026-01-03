"""Pydantic models for users."""
from pydantic import BaseModel


class User(BaseModel):
    """User model."""
    id: int
    name: str
    email: str
    status: str
