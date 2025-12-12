from pydantic import BaseModel
from typing import Dict, Any

class ShoutoutBase(BaseModel):
    name: str
    message: str

class ShoutoutCreate(ShoutoutBase):
    pass

class Shoutout(ShoutoutBase):
    id: int
    reactions: Dict[str, int] = {}

    class Config:
        from_attributes = True

