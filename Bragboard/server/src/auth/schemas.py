from pydantic import BaseModel
from typing import Optional

class UserRegister(BaseModel):
    name: str # Added name
    email: str
    password: str
    department: Optional[str] = "Engineering" # Default department

class UserLogin(BaseModel):
    email: str
    password: str

class OTPVerify(BaseModel):
    email: str
    otp: str

class ResetPassword(BaseModel):
    email: str
    otp: str
    new_password: str

class UserOut(BaseModel):
    id: int
    name: Optional[str] = None
    email: str
    department: Optional[str] = None
    role: str

    class Config:
        orm_mode = True

class UserUpdate(BaseModel):
    name: Optional[str] = None
    department: Optional[str] = None
    role: Optional[str] = None