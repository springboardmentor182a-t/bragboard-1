from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from src.database.core import Base

class Shoutout(Base):
    __tablename__ = "shoutouts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    sender_id = Column(Integer, nullable=False)
    receiver_id = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
