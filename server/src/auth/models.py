"""Pydantic models for authentication."""
from pydantic import BaseModel, EmailStr


class UserLogin(BaseModel):
    """User login request model."""
    email: EmailStr
    password: str


class UserSignup(BaseModel):
    """User signup request model."""
    name: str
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    """Authentication response model."""
    token: str
    user: dict
