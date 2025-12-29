from pydantic import BaseModel
from typing import List, Optional

class ShoutoutCreate(BaseModel):
    message: str
    recipient_ids: Optional[List[int]] = []
