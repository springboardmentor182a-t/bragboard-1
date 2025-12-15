from fastapi import APIRouter, Depends, HTTPException
from src.entities import user
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from src.database.core import SessionLocal
from src.auth.schemas import UserCreate, ForgotPassword, ResetPassword
from src.auth.models import User
from src.auth.utils import verify_password, hash_password, create_access_token
from src.auth.email_service import generate_otp, send_otp_email

router = APIRouter()


# ------------------------------
# Database Dependency
# ------------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ------------------------------
# JSON Login Schema
# ------------------------------
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# ------------------------------
# Register
# ------------------------------
@router.post("/register/")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(400, "Email already registered")

    hashed_pwd = hash_password(user.password)
    otp = generate_otp()

    new_user = User(
    email=user.email,
    password=hashed_pwd,
    otp=otp,
    is_verified=False,
    role="employee",
    is_approved=False,
    status="pending"
    )


    db.add(new_user)
    db.commit()

    send_otp_email(user.email, otp)

    return {"msg": "Registration successful. OTP sent to email"}


# ------------------------------
# Verify OTP
# ------------------------------
@router.post("/verify-otp/")
def verify_otp(email: str, otp: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email, User.otp == otp).first()
    if not user:
        raise HTTPException(400, "Invalid OTP or email")

    user.is_verified = True
    user.otp = None
    db.commit()

    return {"msg": "Email verified successfully"}


# ------------------------------
# LOGIN (JSON Version)
# ------------------------------
@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()

    if not user:
        raise HTTPException(400, "Incorrect email or password")

    if not verify_password(payload.password, user.password):
        raise HTTPException(400, "Incorrect email or password")

    if not user.is_verified:
        raise HTTPException(403, "Email not verified")
    if not user.is_approved:
        raise HTTPException(403, "Account pending admin approval")


    # Create JWT with role included
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
        "email": user.email,
    }


# ------------------------------
# Forgot Password
# ------------------------------
@router.post("/forgot-password/")
def forgot_password(request: ForgotPassword, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(400, "Email not registered")

    otp = generate_otp()
    user.otp = otp
    db.commit()

    send_otp_email(request.email, otp)

    return {"msg": "OTP sent to registered email"}


# ------------------------------
# Reset Password
# ------------------------------
@router.post("/reset-password/")
def reset_password(request: ResetPassword, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        User.email == request.email,
        User.otp == request.otp
    ).first()

    if not user:
        raise HTTPException(400, "Invalid OTP or email")

    user.password = hash_password(request.new_password)
    user.otp = None
    db.commit()

    return {"msg": "Password reset successfully"}
