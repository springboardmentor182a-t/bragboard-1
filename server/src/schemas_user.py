from pydantic import BaseModel
from datetime import datetime

# Schema the client sends during registration
class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    department: str

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
