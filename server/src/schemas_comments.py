from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class CommentCreate(BaseModel):
    content: str = Field(..., min_length=1, description="Comment content")


class CommentUpdate(BaseModel):
    content: str = Field(..., min_length=1, description="Updated comment content")


class UserInfo(BaseModel):
    id: int
    name: str
    
    class Config:
        from_attributes = True


class CommentResponse(BaseModel):
    id: int
    content: str
    created_at: datetime
    user: UserInfo
    
    class Config:
        from_attributes = True
