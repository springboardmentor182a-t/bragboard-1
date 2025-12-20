from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from src.database import Base

class LeaderboardEntry(Base):
    __tablename__ = "leaderboard"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=True)
    points = Column(Integer, default=0)
    attempts = Column(Integer, default=0)
    level = Column(String, default="Bronze")
    last_active = Column(DateTime, default=datetime.utcnow)
