# server/src/schemas_user.py

from pydantic import BaseModel, EmailStr
from typing import Optional

from pydantic import BaseModel
from datetime import datetime

# Schema the client sends during registration
class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    department: str


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
# Schema returned to the client after registration
class UserOut(BaseModel):
    id: int
    name: str
    email: str
    department: str
    role: str
    joined_at: datetime

    class Config:
        from_attributes = True  # earlier it was orm_mode = True
from pydantic import BaseModel

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str
