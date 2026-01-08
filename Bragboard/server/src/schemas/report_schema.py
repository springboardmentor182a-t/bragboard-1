from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ReportCreate(BaseModel):
    shoutout_id: int
    reason: str


class ResolveReport(BaseModel):
    admin_notes: Optional[str] = None
    status: Optional[str] = "resolved"


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
    reporter_name: str = None

    class Config:
        orm_mode = True

    @classmethod
    def from_orm(cls, obj):
        # Allow default behavior but inject reporter_name
        # Since reporter is a relationship, we can access obj.reporter.name
        model = super().from_orm(obj)
        if obj.reporter:
            model.reporter_name = obj.reporter.name
        return model
