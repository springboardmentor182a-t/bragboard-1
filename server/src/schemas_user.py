# server/src/schemas_user.py

from pydantic import BaseModel, EmailStr
from typing import Optional


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    department: Optional[str] = None


class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    department: Optional[str] = None
    is_active: bool

    class Config:
        orm_mode = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
