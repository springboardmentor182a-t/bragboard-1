from sqlalchemy import Column, Integer, ForeignKey
from .user import Base

class Leaderboard(Base):
    __tablename__ = "leaderboard"
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    points = Column(Integer, default=0)
