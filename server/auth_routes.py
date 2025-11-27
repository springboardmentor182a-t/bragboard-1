from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from schemas import UserCreate, UserLogin, ForgotPassword, ResetPassword
from models import User
from utils import verify_password, hash_password, create_access_token
from email_service import generate_otp, send_otp_email

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register/")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(400, "Email already registered")
    hashed_pwd = hash_password(user.password)
    otp = generate_otp()
    new_user = User(email=user.email, password=hashed_pwd, otp=otp)
    db.add(new_user)
    db.commit()
    send_otp_email(user.email, otp)
    return {"msg": "Registration successful. OTP sent to email"}

@router.post("/verify-otp/")
def verify_otp(email: str, otp: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email, User.otp == otp).first()
    if not user:
        raise HTTPException(400, "Invalid OTP or email")
    user.is_verified = True
    user.otp = None
    db.commit()
    return {"msg": "Email verified successfully"}

@router.post("/login/")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(400, "Incorrect email or password")
    if not db_user.is_verified:
        raise HTTPException(400, "Account not verified")
    access_token = create_access_token({"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

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

@router.post("/reset-password/")
def reset_password(request: ResetPassword, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email, User.otp == request.otp).first()
    if not user:
        raise HTTPException(400, "Invalid OTP or email")
    user.password = hash_password(request.new_password)
    user.otp = None
    db.commit()
    return {"msg": "Password reset successfully"}