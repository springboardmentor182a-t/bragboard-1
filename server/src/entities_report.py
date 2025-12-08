# src/entities_report.py
from sqlalchemy import Column, Integer, String, DateTime
from src.database import Base
from datetime import datetime

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer, nullable=False)       # ID of the shoutout being reported
    reported_by = Column(Integer, nullable=False)       # Employee ID who reported it
    reason = Column(String, nullable=False)             # Reason for reporting
    status = Column(String, default="PENDING")          # PENDING, RESOLVED, REJECTED
    reported_at = Column(DateTime, default=datetime.utcnow)
    resolved_by = Column(Integer, nullable=True)        # Admin ID who resolved
    resolved_at = Column(DateTime, nullable=True)
