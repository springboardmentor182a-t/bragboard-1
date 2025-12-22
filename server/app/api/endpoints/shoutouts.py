from fastapi import APIRouter
from app.schemas.shoutout import Shoutout

router = APIRouter()

# Dummy data (replace with DB later)
SHOUTOUTS = [
    {"id": 1, "employee": "Alice", "message": "Great teamwork!", "status": "Approved"},
    {"id": 2, "employee": "Bob", "message": "Excellent delivery", "status": "Pending"},
]

@router.get("/", response_model=list[Shoutout])
def get_shoutouts():
    return SHOUTOUTS
