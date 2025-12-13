# server/src/schemas/schema_report.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Schema for creating a report
class ReportCreate(BaseModel):
    shoutout_id: int
    reason: str

# Schema for individual report response
class ReportResponse(BaseModel):
    id: int
    shoutout_id: int
    reported_by: int
    reason: str
    status: str
    reported_at: datetime
    resolved_by: Optional[int] = None
    resolved_at: Optional[datetime] = None

    model_config = {"from_attributes": True}

# Schema for admin list response
class ReportListAdmin(BaseModel):
    id: int
    shoutout_id: int
    reported_by: int
    reason: str
    status: str
    reported_at: datetime
    resolved_by: Optional[int] = None
    resolved_at: Optional[datetime] = None

    model_config = {"from_attributes": True}

# Schema for resolving a report
class ReportResolve(BaseModel):
    report_id: int
    action: str   # RESOLVE or REJECT
    admin_id: int
