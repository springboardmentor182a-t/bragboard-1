# app/routes/auth.py
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.ext.asyncio import AsyncSession
from app.db import get_db
from app.schemas import UserCreate, UserOut
from app.utils import hash_password, verify_password, generate_otp, make_otp_expiry, send_verification_email, send_reset_email, hash_string
from app import crud
from app.services import token_service
from datetime import datetime, timezone
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/api/auth", tags=["auth"])

class VerifyOtpIn(BaseModel):
    email: EmailStr
    otp: str

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class TokenOut(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_at: datetime

class RefreshIn(BaseModel):
    refresh_token: str

class ForgotIn(BaseModel):
    email: EmailStr

class ResetIn(BaseModel):
    email: EmailStr
    otp: str
    new_password: str

# Register (if you already have register, keep it or replace)
@router.post("/register", status_code=201)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    existing = await crud.get_user_by_email(db, user_in.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    password_hash = hash_password(user_in.password)
    user = await crud.create_user(db, user_in, password_hash)

    otp = generate_otp()
    expires_at = make_otp_expiry()
    await crud.create_otp(db, user.id, otp, purpose="verify", expires_at=expires_at)
    send_verification_email(user.email, otp)
    return {"message": "Registered successfully. Verification OTP sent to email."}

# Verify OTP
@router.post("/verify-otp")
async def verify_otp(payload: VerifyOtpIn, db: AsyncSession = Depends(get_db)):
    user = await crud.get_user_by_email(db, payload.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    otp_obj = await crud.get_valid_otp(db, user.id, payload.otp, purpose="verify")
    if not otp_obj:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    await crud.consume_otp(db, otp_obj)
    await crud.mark_user_verified(db, user)
    return {"message": "Email verified successfully"}

# Login
@router.post("/login", response_model=TokenOut)
async def login(payload: LoginIn, db: AsyncSession = Depends(get_db)):
    user = await crud.get_user_by_email(db, payload.email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not verify_password(payload.password, user.password_hash):
        # optionally increment failed_login_attempts here
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not user.is_email_verified:
        raise HTTPException(status_code=403, detail="Email not verified")

    access_token, access_expires = token_service.create_access_token(subject=user.id)
    refresh_plain, refresh_expires = token_service.create_refresh_token()
    refresh_hash = token_service.hash_refresh_token(refresh_plain)
    await crud.create_refresh_token_entry(db, user.id, refresh_hash, refresh_expires)

    return TokenOut(access_token=access_token, refresh_token=refresh_plain, expires_at=access_expires)

# Refresh token
@router.post("/token/refresh", response_model=TokenOut)
async def refresh_token(payload: RefreshIn, db: AsyncSession = Depends(get_db)):
    # lookup token by hash
    token_hash = token_service.hash_refresh_token(payload.refresh_token)
    token_obj = await crud.get_refresh_token_by_hash(db, token_hash)
    if not token_obj or token_obj.revoked or token_obj.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    # rotate: revoke current, issue new
    await crud.revoke_refresh_token(db, token_obj)
    new_refresh, new_refresh_expires = token_service.create_refresh_token()
    new_refresh_hash = token_service.hash_refresh_token(new_refresh)
    await crud.create_refresh_token_entry(db, token_obj.user_id, new_refresh_hash, new_refresh_expires)

    access_token, access_expires = token_service.create_access_token(subject=token_obj.user_id)
    return TokenOut(access_token=access_token, refresh_token=new_refresh, expires_at=access_expires)

# Logout
class LogoutIn(BaseModel):
    refresh_token: str

@router.post("/logout")
async def logout(payload: LogoutIn, db: AsyncSession = Depends(get_db)):
    token_hash = token_service.hash_refresh_token(payload.refresh_token)
    token_obj = await crud.get_refresh_token_by_hash(db, token_hash)
    if token_obj:
        await crud.revoke_refresh_token(db, token_obj)
    # always return 204/200 even if token not found (idempotent)
    return {"message": "Logged out"}

# Forgot password (send reset OTP)
@router.post("/forgot")
async def forgot_password(payload: ForgotIn, db: AsyncSession = Depends(get_db)):
    user = await crud.get_user_by_email(db, payload.email)
    # always return success message (avoid revealing account existence)
    if user:
        otp = generate_otp()
        expires_at = make_otp_expiry()
        await crud.create_reset_otp(db, user.id, otp, expires_at)
        send_reset_email(user.email, otp)
    return {"message": "If that account exists, a reset OTP was sent"}

# Reset password (verify OTP and update password)
@router.post("/reset-password")
async def reset_password(payload: ResetIn, db: AsyncSession = Depends(get_db)):
    user = await crud.get_user_by_email(db, payload.email)
    if not user:
        # avoid revealing, but here client expects same message
        raise HTTPException(status_code=400, detail="Invalid reset request")
    otp_obj = await crud.get_valid_otp(db, user.id, payload.otp, purpose="reset")
    if not otp_obj:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    # set new password and invalidate refresh tokens
    user.password_hash = hash_password(payload.new_password)
    await db.commit()
    await crud.consume_otp(db, otp_obj)
    await crud.revoke_all_user_refresh_tokens(db, user.id)
    return {"message": "Password reset successful"}
