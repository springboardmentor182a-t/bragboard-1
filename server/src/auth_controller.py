<<<<<<< HEAD
﻿from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from datetime import datetime

from src.core import get_db
from src.entities_user import User
from src.schemas_user import UserCreate, UserOut, ChangePasswordRequest
from src.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_access_token
)

from src.otp_service import create_and_store_otp, verify_otp
=======
﻿# server/src/auth_controller.py
>>>>>>> 2cc6a31e3e11bce788783f6a8b7e4e5eb48d7ac5

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import random

# --------------------------------------------------------
# ROUTER SETUP
# --------------------------------------------------------
router = APIRouter(prefix="/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

<<<<<<< HEAD
=======
# In-memory storage (for testing)
users_db = {}      # email -> {name, email, password, role}
otp_store = {}     # email -> otp

# --------------------
# Schemas
# --------------------
class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str  # admin / employee
>>>>>>> 2cc6a31e3e11bce788783f6a8b7e4e5eb48d7ac5

# --------------------------------------------------------
# REQUEST / RESPONSE MODELS
# --------------------------------------------------------
class LoginRequest(BaseModel):
    email: str
    password: str

<<<<<<< HEAD

class TokenOut(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


# --------------------------------------------------------
# REGISTER USER
# --------------------------------------------------------
@router.post("/register", response_model=UserOut)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = hash_password(user_in.password)

    user = User(
        name=user_in.name,
        email=user_in.email,
        hashed_password=hashed,
        department=user_in.department,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


# --------------------------------------------------------
# LOGIN (Handles attempts + last_active)
# --------------------------------------------------------
@router.post("/login", response_model=TokenOut)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()

    # ❌ User exists BUT password wrong → increase attempts
    if not user or not verify_password(req.password, user.hashed_password):

        if user:
            user.attempts += 1
            db.commit()

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    # ✅ Successful login
    user.attempts = 0
    user.last_active = datetime.utcnow()  # ✅ already correct
    db.commit()

    token_payload = {
        "sub": user.email,
        "user_id": user.id,
        "role": user.role,
    }

    access = create_access_token(token_payload)
    refresh = create_refresh_token(token_payload)

    return {
        "access_token": access,
        "refresh_token": refresh,
        "token_type": "bearer",
    }


# --------------------------------------------------------
# GET CURRENT USER DETAILS
# --------------------------------------------------------
@router.get("/me")
def get_me(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
=======
class ForgotPasswordRequest(BaseModel):
    email: str

class VerifyOTPRequest(BaseModel):
    email: str
    otp: str

class ResetPasswordRequest(BaseModel):
    email: str
    otp: str
    new_password: str

# --------------------
# Helper functions
# --------------------
def hash_password(password: str) -> str:
    return password + "_hashed"  # dummy hash

def verify_password(password: str, hashed: str) -> bool:
    return hash_password(password) == hashed
>>>>>>> 2cc6a31e3e11bce788783f6a8b7e4e5eb48d7ac5

def create_access_token(data: dict) -> str:
    return "dummy_token_" + data.get("email", "")

<<<<<<< HEAD
    return {
        "email": payload.get("sub"),
        "user_id": payload.get("user_id"),
        "role": payload.get("role"),
    }
=======
def send_otp_email(email: str, otp: str):
    print(f"Sending OTP {otp} to {email}")  # for testing

# --------------------
# Routes
# --------------------
@router.post("/register")
async def register(req: RegisterRequest):
    if req.email in users_db:
        raise HTTPException(status_code=400, detail="User already exists")
    users_db[req.email] = {
        "name": req.name,
        "email": req.email,
        "password": hash_password(req.password),
        "role": req.role
    }
    return {"message": "Registered successfully"}

>>>>>>> 2cc6a31e3e11bce788783f6a8b7e4e5eb48d7ac5


# --------------------------------------------------------
# OTP — SEND
# --------------------------------------------------------
@router.post("/send-otp")
<<<<<<< HEAD
def send_otp(email: str, db: Session = Depends(get_db)):
    code = create_and_store_otp(email, db)
    return {"message": "OTP sent successfully", "otp": code}  # remove OTP in production


# --------------------------------------------------------
# OTP — VERIFY (UPDATED last_active)
# --------------------------------------------------------
@router.post("/verify-otp")
def verify_otp_route(email: str, otp: str, db: Session = Depends(get_db)):
    is_valid = verify_otp(email, otp, db)
=======
async def send_otp(req: ForgotPasswordRequest):
    if req.email not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    otp = str(random.randint(100000, 999999))
    otp_store[req.email] = otp
    send_otp_email(req.email, otp)
    return {"message": "OTP sent"}
>>>>>>> 2cc6a31e3e11bce788783f6a8b7e4e5eb48d7ac5


@router.post("/forgot-password")
async def forgot_password(req: ForgotPasswordRequest):
    if req.email not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    otp = str(random.randint(100000, 999999))
    otp_store[req.email] = otp
    send_otp_email(req.email, otp)
    return {"message": "OTP sent"}


# ----------------------------
# ✔ STEP 2: VERIFY OTP ONLY
# ----------------------------
@router.post("/verify-otp")
async def verify_otp(req: VerifyOTPRequest):
    email = req.email
    otp = req.otp

    if email not in otp_store:
        raise HTTPException(status_code=400, detail="No OTP sent for this email")

    if otp_store[email] != otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

<<<<<<< HEAD
    # ✅ NEW: update last_active on OTP verification
    user = db.query(User).filter(User.email == email).first()
    if user:
        user.last_active = datetime.utcnow()
        db.commit()

    return {"message": "OTP verified successfully"}


# --------------------------------------------------------
# CHANGE PASSWORD (UPDATED last_active)
# --------------------------------------------------------
@router.post("/change-password")
def change_password(
    request: ChangePasswordRequest,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    payload = decode_access_token(token)
=======
    return {"message": "OTP verified successfully"}

>>>>>>> 2cc6a31e3e11bce788783f6a8b7e4e5eb48d7ac5

# ----------------------------
# ✔ STEP 3: RESET PASSWORD
# ----------------------------
@router.post("/reset-password")
async def reset_password(req: ResetPasswordRequest):
    email = req.email

    if email not in users_db:
        raise HTTPException(status_code=404, detail="User not found")

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(request.old_password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Old password is incorrect")

    user.hashed_password = hash_password(request.new_password)
    user.last_active = datetime.utcnow()   # ✅ NEW: update activity
    db.commit()

    # update password
    users_db[email]["password"] = hash_password(req.new_password)

    # delete OTP after success
    del otp_store[email]

    return {"message": "Password reset successfully"}


@router.post("/login")
async def login(req: LoginRequest):
    if req.email not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    user = users_db[req.email]
    if not verify_password(req.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"email": user["email"], "role": user["role"]})
    return {"access_token": token, "role": user["role"], "name": user["name"]}
