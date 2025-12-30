from pydantic import BaseModel

class ShoutoutCreate(BaseModel):
    employee_id: int
    title: str
    description: str

class ShoutoutResponse(BaseModel):
    id: int
    employee_id: int
    title: str
    description: str
    status: str

    class Config:
        from_attributes = True
