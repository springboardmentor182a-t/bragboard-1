from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ShoutoutListResponse(BaseModel):
    id: int
    content: str
    sender_id: int
    receiver_id: int
    sender_name: Optional[str]
    receiver_name: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

class ShoutoutDetailResponse(ShoutoutListResponse):
    sender_email: Optional[str]
    receiver_email: Optional[str]
    content_length: int  # For UI truncation info

class PaginatedShoutouts(BaseModel):
    items: List[ShoutoutListResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
