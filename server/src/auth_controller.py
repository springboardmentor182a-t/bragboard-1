# server/src/auth_controller.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import random

router = APIRouter(prefix="/auth", tags=["auth"])

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

class LoginRequest(BaseModel):
    email: str
    password: str

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

def create_access_token(data: dict) -> str:
    return "dummy_token_" + data.get("email", "")

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


@router.post("/send-otp")
async def send_otp(req: ForgotPasswordRequest):
    if req.email not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    otp = str(random.randint(100000, 999999))
    otp_store[req.email] = otp
    send_otp_email(req.email, otp)
    return {"message": "OTP sent"}


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

    return {"message": "OTP verified successfully"}


# ----------------------------
# ✔ STEP 3: RESET PASSWORD
# ----------------------------
@router.post("/reset-password")
async def reset_password(req: ResetPasswordRequest):
    email = req.email

    if email not in users_db:
        raise HTTPException(status_code=404, detail="User not found")

    # verify otp
    if email not in otp_store:
        raise HTTPException(status_code=400, detail="OTP not sent or expired")

    if otp_store[email] != req.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

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
