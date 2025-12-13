# src/entities_otp.py
from sqlalchemy import Column, Integer, String, DateTime
from src.database import Base
from datetime import datetime

class OTP(Base):
    __tablename__ = "otp"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, nullable=False)
    code = Column(String, nullable=False)  # Store OTP value here
    created_at = Column(DateTime, default=datetime.utcnow)
    purpose = Column(String, default="reset_password")
    expires_at = Column(DateTime)
    expiry = Column(DateTime, nullable=False)
