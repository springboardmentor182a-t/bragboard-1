from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ShoutoutBase(BaseModel):
    title: str
    message: str
    sender_id: int
    receiver_id: int


class ShoutoutCreate(ShoutoutBase):
    pass


class ShoutoutUpdate(BaseModel):  # allow partial update
    title: Optional[str] = None
    message: Optional[str] = None
    sender_id: Optional[int] = None
    receiver_id: Optional[int] = None


class ShoutoutResponse(ShoutoutBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
