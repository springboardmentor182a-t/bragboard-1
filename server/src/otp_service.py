# src/otp_service.py
import random
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from src.entities_otp import OTP

OTP_EXPIRY_MINUTES = 5

def generate_otp():
    return f"{random.randint(100000, 999999)}"

def create_and_store_otp(email: str, db: Session):
    code = generate_otp()
    entry = OTP(email=email, code=code)

    db.add(entry)
    db.commit()
    db.refresh(entry)
    return code

def verify_otp(email: str, code: str, db: Session):
    otp = (
        db.query(OTP)
        .filter(OTP.email == email)
        .order_by(OTP.created_at.desc())
        .first()
    )

    if not otp:
        return False

    now = datetime.now(timezone.utc)

    if otp.created_at < now - timedelta(minutes=OTP_EXPIRY_MINUTES):
        return False

    if otp.code != code:
        return False

    return True
