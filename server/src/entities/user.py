# src/entities_user.py

from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from src.database import Base
from pydantic import BaseModel


# -----------------------------
# SQLAlchemy User Table Model
# -----------------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# -----------------------------
# Pydantic Response Model
# -----------------------------
class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    is_verified: bool

    class Config:
        orm_mode = True
