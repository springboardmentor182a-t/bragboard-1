# server/app/models.py
from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field

class ShoutBase(SQLModel):
    message: str
    author_name: str

class Shout(ShoutBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ShoutCreate(ShoutBase):
    pass

class ShoutRead(ShoutBase):
    id: int
    created_at: datetime

class ShoutUpdate(SQLModel):
    message: Optional[str] = None
    author_name: Optional[str] = None
