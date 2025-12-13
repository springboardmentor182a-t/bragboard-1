from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from src.auth_service import AuthService
from src.database import get_db
from src.entities_user import UserResponse   # ✅ Correct import


router = APIRouter(prefix="/auth", tags=["Auth"])


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class OtpVerifyRequest(BaseModel):
    email: str
    otp: str


class ForgotPasswordRequest(BaseModel):
    email: str


auth_service = AuthService()


@router.post("/register")
def register_user(payload: RegisterRequest, db: Session = Depends(get_db)):
    return auth_service.register_user(payload, db)


@router.post("/login")
def login_user(payload: LoginRequest, db: Session = Depends(get_db)):
    return auth_service.login_user(payload, db)


@router.post("/verify-otp")
def verify_otp(payload: OtpVerifyRequest, db: Session = Depends(get_db)):
    return auth_service.verify_otp(payload.email, payload.otp, db)


@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    return auth_service.forgot_password(payload.email, db)
