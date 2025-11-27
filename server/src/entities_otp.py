# src/entities_otp.py
from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime, timezone
from src.database import Base

class OTP(Base):
    __tablename__ = "otp"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, nullable=False)
    code = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
