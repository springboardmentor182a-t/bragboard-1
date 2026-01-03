from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from src.core import Base

class LeaderboardEntry(Base):
    __tablename__ = "leaderboard"

    id = Column(Integer, primary_key=True, index=True)

    # 🔗 link to user table
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    # leaderboard-specific fields
    points = Column(Integer, default=0)
    attempts = Column(Integer, default=0)
    level = Column(String, default="Bronze")
    last_active = Column(DateTime, default=datetime.utcnow)