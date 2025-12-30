from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database import SessionLocal, get_db
from src.auth.schemas import *
from src.models import User
from src.auth.utils import hash_password, verify_password, create_access_token, create_refresh_token, generate_otp
from src.utils.jwt_handler import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


# Register
@router.post("/register")
def register(user: UserRegister, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="User already exists")

    # For development: Auto-verify user
    new_user = User(
        name=user.name,
        email=user.email,
        department=user.department,
        password=hash_password(user.password),
        otp=None,
        is_verified=True  # Auto-verify for development
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"message": "User registered and auto-verified for development", "user_id": new_user.id}

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

    # Bypass email verification for development
    if not user.is_verified:
        print(f"[DEV] Bypassing verification for user: {user.email}")
        user.is_verified = True
        db.commit()

    # Include id and role in token payload as expected by jwt_handler
    token_data = {"sub": user.email, "id": user.id, "role": user.role}
    
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user_id": user.id,
        "email": user.email,
        "role": user.role,
        "is_verified": user.is_verified
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

@router.get("/me", response_model=UserOut)
def get_me(current_user: UserOut = Depends(get_current_user)):
    return current_user
