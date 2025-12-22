from pydantic import BaseModel

class Shoutout(BaseModel):
    id: int
    employee: str
    message: str
    status: str

    class Config:
        from_attributes = True
