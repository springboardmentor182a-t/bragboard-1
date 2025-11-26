# app/schemas.py
from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    department: Optional[str] = None
    role: Optional[str] = "employee"

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    department: Optional[str]
    role: str

    class Config:
        orm_mode = True
