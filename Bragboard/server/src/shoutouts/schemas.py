from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime

class ReactionBase(BaseModel):
    type: str # 'like', 'clap', 'star'

class ReactionCreate(ReactionBase):
    pass

class ReactionOut(ReactionBase):
    id: int
    user_id: int
    shoutout_id: int
    created_at: datetime

    class Config:
        orm_mode = True

class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    pass

class CommentUpdate(CommentBase):
    pass

class ShoutOutUpdate(BaseModel):
    recipient_ids: Optional[List[int]] = None
    message: Optional[str] = None

class CommentOut(CommentBase):
    id: int
    shoutout_id: int
    user_id: int
    user_name: Optional[str] = None
    created_at: datetime

    class Config:
        orm_mode = True

class ShoutOutCreate(BaseModel):
    recipient_ids: List[int]
    message: str

class ShoutOutRecipientOut(BaseModel):
    recipient_id: int
    recipient_name: Optional[str] = None

    class Config:
        orm_mode = True

class ShoutOutOut(BaseModel):
    id: int
    sender_id: int
    sender_name: Optional[str] = None
    message: str
    created_at: datetime
    recipients: List[ShoutOutRecipientOut] = []
    comments: List[CommentOut] = []
    reaction_counts: Dict[str, int] = {}
    user_reactions: List[str] = [] # Reactions by current user

    class Config:
        orm_mode = True
