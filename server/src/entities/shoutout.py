from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, List


class ShoutoutBase(BaseModel):
    title: str
    message: str
    sender_id: int
    receiver_id: int


class ShoutoutCreate(ShoutoutBase):
    pass


class ShoutoutUpdate(BaseModel):
    title: Optional[str] = None
    message: Optional[str] = None
    sender_id: Optional[int] = None
    receiver_id: Optional[int] = None


class ShoutoutAdminResponse(BaseModel):
    id: int
    title: str
    message: str
    sender_id: int
    receiver_id: int
    created_at: datetime
    is_deleted: bool
    deleted_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class ShoutoutResponse(ShoutoutBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class PaginatedShoutoutsResponse(BaseModel):
    items: List[ShoutoutAdminResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
