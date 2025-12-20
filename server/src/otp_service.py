# server/src/otp_service.py
import random
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from src.entities_otp import OTP

# OTP is valid for 5 minutes
OTP_EXPIRY_MINUTES = 5

def generate_otp() -> str:
    return f"{random.randint(100000, 999999)}"

def create_and_store_otp(email: str, db: Session) -> str:
    code = generate_otp()

    otp_entry = OTP(
        email=email,
        code=code
    )

    db.add(otp_entry)
    db.commit()
    db.refresh(otp_entry)

    return code

def verify_otp(email: str, code: str, db: Session) -> bool:
    otp_record = (
        db.query(OTP)
        .filter(OTP.email == email)
        .order_by(OTP.created_at.desc())
        .first()
    )

    if not otp_record:
        return False

    # Use timezone-aware 'now' to match created_at (which is timezone-aware)
    now = datetime.now(timezone.utc)

    # expiry check
    if otp_record.created_at < now - timedelta(minutes=OTP_EXPIRY_MINUTES):
        return False

    # check code
    if otp_record.code != code:
        return False

    # (optional) mark otp as used — depends on your model; if you add a flag, commit here.
    # For now we leave record as-is but you can delete or mark verified if desired.

    return True
