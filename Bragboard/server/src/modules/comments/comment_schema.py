from pydantic import BaseModel

class CommentCreate(BaseModel):
    content: str

class CommentUpdate(BaseModel):
    content: str

class CommentOut(BaseModel):
    id: int
    shoutout_id: int
    user_id: int
    content: str

    class Config:
        from_attributes = True
