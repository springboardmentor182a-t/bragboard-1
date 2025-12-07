from sqlalchemy import Column, Integer, Text, DateTime, Boolean
from sqlalchemy.sql import func
from database import Base

class Shoutout(Base):
    __tablename__ = "shoutouts"
    
    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)          
    sender_id = Column(Integer, nullable=True)       
    receiver_id = Column(Integer, nullable=True)     
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    is_deleted = Column(Boolean, default=False)
