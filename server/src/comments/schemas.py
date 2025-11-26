from datetime import datetime
from pydantic import BaseModel

class CommentCreate(BaseModel):
    content: str
    user_id: int

class CommentUpdate(BaseModel):
    content: str
    user_id: int

class CommentRead(BaseModel):
    id: int
    shoutout_id: int
    user_id: int
    content: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
