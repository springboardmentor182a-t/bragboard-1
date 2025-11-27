from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database import get_db
from src.auth_service import (
    register_user,
    login_user,
    send_otp_to_email,
    verify_otp_and_update,
)
from src.schemas_user import UserRegister, UserLogin, OTPVerify

router = APIRouter(tags=["Authentication"])

@router.options("/{path:path}")
def preflight(path: str):
    return {"message": "OK"}

@router.post("/register")
def register(data: UserRegister, db: Session = Depends(get_db)):
    return register_user(data, db)

@router.post("/login")
def login(data: UserLogin, db: Session = Depends(get_db)):
    return login_user(data, db)

@router.post("/send-otp")
def send_otp(email: str, db: Session = Depends(get_db)):
    return send_otp_to_email(email, db)

@router.post("/verify-otp")
def verify_otp(data: OTPVerify, db: Session = Depends(get_db)):
    return verify_otp_and_update(data, db)
