from datetime import datetime
from pydantic import BaseModel

class ReportCreate(BaseModel):
    reason: str

class ReportBase(BaseModel):
    id: int
    shoutout_id: int
    reported_by: int
    reason: str
    created_at: datetime
    status: str

    class Config:
        orm_mode = True

class ReportDetail(ReportBase):
    resolved_at: datetime | None = None
    resolved_by: int | None = None

class ReportResolve(BaseModel):
    action: str  # e.g. "dismiss" or "remove_shoutout"
    resolution_note: str | None = None
