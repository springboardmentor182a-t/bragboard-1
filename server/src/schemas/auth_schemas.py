from pydantic import BaseModel, EmailStr, Field

# Registration request
class RegisterRequest(BaseModel):
    name: str = Field(..., example="John Doe")
    email: EmailStr
    password: str
    role: str = "employee"  # "admin" or "employee"
    department: str = "General"

# Login request (for sending OTP)
class LoginRequest(BaseModel):
    email: EmailStr

# OTP verification request
class OTPRequest(BaseModel):
    email: EmailStr
    otp: str

# Reset password request
class ResetPasswordRequest(BaseModel):
    email: EmailStr
    password: str
    otp: str

# Forgot password request
class ForgotPasswordRequest(BaseModel):
    email: EmailStr
