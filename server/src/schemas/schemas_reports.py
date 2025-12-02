from pydantic import BaseModel
from datetime import datetime

class ReportCreate(BaseModel):
    shoutout_id: int
    reason: str

class ReportResponse(BaseModel):
    id: int
    shoutout_id: int
    reason: str
    status: str
    reported_at: datetime

    class Config:
        orm_mode = True

class ReportListAdmin(BaseModel):
    id: int
    shoutout_id: int
    reported_by: int
    reason: str
    status: str
    reported_at: datetime
    resolved_by: int | None
    resolved_at: datetime | None

    class Config:
        orm_mode = True

class ReportResolve(BaseModel):
    action: str = "RESOLVE"
