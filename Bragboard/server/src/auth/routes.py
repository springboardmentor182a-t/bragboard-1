from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from auth.schemas import *
from auth.models import User
from auth.utils import *

router = APIRouter(prefix="/auth", tags=["Authentication"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Register
@router.post("/register")
def register(user: UserRegister, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="User already exists")

    otp = generate_otp()
    new_user = User(
        email=user.email,
        password=hash_password(user.password),
        otp=otp,
        is_verified=False
    )
    db.add(new_user)
    db.commit()
    return {"message": "User registered, verify OTP", "otp": otp}

# Verify OTP
@router.post("/verify-otp")
def verify_otp(data: OTPVerify, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or user.otp != data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    user.is_verified = True
    user.otp = None
    db.commit()
    return {"message": "Account verified successfully"}

# Login
@router.post("/login")
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access_token = create_access_token({"sub": user.email})
    refresh_token = create_refresh_token({"sub": user.email})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token
    }

# Forgot password (send OTP)
@router.post("/forgot-password")
def forgot_password(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    otp = generate_otp()
    user.otp = otp
    db.commit()

    return {"message": "OTP sent", "otp": otp}

# Reset Password
@router.post("/reset-password")
def reset_password(data: ResetPassword, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or user.otp != data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    user.password = hash_password(data.new_password)
    user.otp = None
    db.commit()

    return {"message": "Password reset successful"}
