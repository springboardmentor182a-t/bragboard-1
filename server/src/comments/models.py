from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from database import Base

class Comment(Base):
    __tablename__ = "comments"
    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer, index=True)
    user_id = Column(Integer)
    content = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
