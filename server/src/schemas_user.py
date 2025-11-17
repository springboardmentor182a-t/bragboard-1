from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    department: Optional[str] = None

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    department: Optional[str]
    role: str
    joined_at: datetime

    class Config:
        orm_mode = True
