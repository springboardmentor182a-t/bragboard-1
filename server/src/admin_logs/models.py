from sqlalchemy import Column, Integer, Text, ForeignKey, DateTime, String
from sqlalchemy.orm import relationship
from datetime import datetime

from src.database.core import Base
from src.auth.models import User  


class AdminLog(Base):
    __tablename__ = "admin_logs"

    id = Column(Integer, primary_key=True, index=True)
    admin_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action = Column(Text, nullable=False)
    target_id = Column(Integer, nullable=True)
    target_type = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    admin = relationship("User")
