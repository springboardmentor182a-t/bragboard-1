# app/utils.py
import secrets
import string
import hashlib
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from app.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def generate_otp(length: int = 6) -> str:
    digits = string.digits
    return "".join(secrets.choice(digits) for _ in range(length))

def otp_expiry_minutes() -> int:
    return int(settings.OTP_EXPIRE_MINUTES)

def make_otp_expiry() -> datetime:
    return datetime.now(timezone.utc) + timedelta(minutes=otp_expiry_minutes())

def hash_string(s: str) -> str:
    return hashlib.sha256(s.encode("utf-8")).hexdigest()

# Email stubs
def send_email_stub(to_email: str, subject: str, body: str) -> None:
    print("=== EMAIL SENT (stub) ===")
    print(f"To: {to_email}")
    print(f"Subject: {subject}")
    print(body)
    print("=========================")

def send_verification_email(to_email: str, otp: str) -> None:
    subject = "Verify your BragBoard account"
    body = f"Your verification code is: {otp}\nExpires in {otp_expiry_minutes()} minutes."
    send_email_stub(to_email, subject, body)

def send_reset_email(to_email: str, otp: str) -> None:
    subject = "Reset your BragBoard password"
    body = f"Your password reset code is: {otp}\nExpires in {otp_expiry_minutes()} minutes."
    send_email_stub(to_email, subject, body)
