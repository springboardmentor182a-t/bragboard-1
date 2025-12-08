from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ReportCreate(BaseModel):
    shoutout_id: int
    reason: str


class ResolveReport(BaseModel):
    admin_notes: Optional[str] = None


class ReportOut(BaseModel):
    id: int
    shoutout_id: int
    reported_by: int
    reason: str
    status: str

    admin_notes: Optional[str] = None
    created_at: datetime
    resolved_at: Optional[datetime] = None
    resolved_by: Optional[int] = None

    class Config:
        orm_mode = True
