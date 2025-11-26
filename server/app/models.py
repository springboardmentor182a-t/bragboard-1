# app/models.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, func, Enum
from app.db import Base   # ← must import Base from app.db
import enum

class RoleEnum(str, enum.Enum):
    employee = "employee"
    admin = "admin"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    department = Column(String(100), nullable=True)
    role = Column(Enum(RoleEnum), nullable=False, default=RoleEnum.employee)
    is_email_verified = Column(Boolean, default=False)
    failed_login_attempts = Column(Integer, default=0)
    locked_until = Column(DateTime, nullable=True)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())

class RefreshToken(Base):
    __tablename__ = "refresh_tokens"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token_hash = Column(String(512), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=False)
    revoked = Column(Boolean, default=False)
    replaced_by_id = Column(Integer, nullable=True)

class EmailOtp(Base):
    __tablename__ = "email_otps"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    otp = Column(String(10), nullable=False)
    purpose = Column(String(20), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=False)
    consumed = Column(Boolean, default=False)
    attempts = Column(Integer, default=0)
