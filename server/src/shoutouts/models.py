from sqlalchemy import Column, Integer, String, DateTime, Boolean
from datetime import datetime
from database.core import Base

class Shoutout(Base):
    __tablename__ = "shoutouts"

    id = Column(Integer, primary_key=True, index=True)
    emoji = Column(String, nullable=True)
    title = Column(String, nullable=True)
    message = Column(String, nullable=False)
    sender_id = Column(Integer, nullable=False)
    receiver_id = Column(Integer, nullable=False)
    tag = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    is_deleted = Column(Boolean, default=False)
