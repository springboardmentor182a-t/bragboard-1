# src/routes/auth_utils.py
import hashlib
import hmac
import secrets
import jwt
from datetime import datetime, timedelta

# Secret key for JWT
JWT_SECRET = "supersecretkey"
JWT_ALGORITHM = "HS256"
JWT_EXP_DELTA_MINUTES = 60

# -------------------
# Password Hashing
# -------------------
def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    pwd_hash = hashlib.sha256(f"{salt}{password}".encode()).hexdigest()
    return f"{salt}${pwd_hash}"

def verify_password(password: str, hashed: str) -> bool:
    try:
        salt, pwd_hash = hashed.split("$")
        return hmac.compare_digest(
            pwd_hash,
            hashlib.sha256(f"{salt}{password}".encode()).hexdigest()
        )
    except Exception:
        return False

# -------------------
# JWT Token
# -------------------
def create_access_token(data: dict) -> str:
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(minutes=JWT_EXP_DELTA_MINUTES)
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token

# -------------------
# OTP Email Simulation
# -------------------
def send_otp_email(email: str, otp: str):
    print(f"Sending OTP {otp} to {email}")
