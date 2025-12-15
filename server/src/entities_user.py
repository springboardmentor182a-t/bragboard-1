from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from src.core import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    department = Column(String, nullable=True)

    # role & join date
    role = Column(String, default="employee")
    joined_at = Column(DateTime(timezone=True), server_default=func.now())

    # ⭐ Leaderboard fields
    attempts = Column(Integer, default=0)
    level = Column(String, default="Bronze")
    last_active = Column(DateTime(timezone=True), server_default=func.now())
