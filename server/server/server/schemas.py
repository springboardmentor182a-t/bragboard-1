from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=50)
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=50)

class ForgotPassword(BaseModel):
    email: EmailStr

class ResetPassword(BaseModel):
    email: EmailStr
    otp: str
    new_password: str = Field(..., min_length=8, max_length=50)