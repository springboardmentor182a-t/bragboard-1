from sqlalchemy import Column, Integer, Text, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from src.reports.enums import ReportStatus
from datetime import datetime

from src.database.core import Base  # whatever your Base is
from src.shoutouts.models import Shoutout  # adjust name
from src.auth.models import User

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id"), nullable=False)
    reported_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    reason = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # extra fields (if allowed)
    status = Column(Enum(ReportStatus), default=ReportStatus.OPEN)
    resolved_at = Column(DateTime, nullable=True)
    resolved_by = Column(Integer, ForeignKey("users.id"), nullable=True)

    shoutout = relationship("Shoutout", back_populates="reports")
    reporter = relationship("User", foreign_keys=[reported_by])
    resolver = relationship("User", foreign_keys=[resolved_by]) 
