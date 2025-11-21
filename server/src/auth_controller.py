from fastapi import APIRouter, status
# NOTE: All database and SQLAlchemy imports (AsyncSession, Depends, etc.) are REMOVED
from src.users.models import UserResponse 

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)

# -------------------------------------------------------------
# MOCK DATA DEFINITION 
# -------------------------------------------------------------
MOCK_USERS = [
    {"id": 1, "username": "admin_user", "email": "admin@bragboard.com", "role": "Admin", "is_active": True},
    {"id": 2, "username": "test_member", "email": "member@example.com", "role": "User", "is_active": True},
    {"id": 3, "username": "inactive_user", "email": "banned@example.com", "role": "User", "is_active": False}
]

# -------------------------------------------------------------
# Endpoints using Mock Data
# -------------------------------------------------------------

@router.get("/", response_model=list[UserResponse])
async def get_all_users():
    """Returns the list of mock users for the frontend."""
    return MOCK_USERS 

@router.delete("/{user_id}", status_code=204)
async def delete_user(user_id: int):
    """Mocks the deletion process for submission."""
    print(f"Mock action: Deleted user {user_id}")
    return 

@router.put("/{user_id}", status_code=200)
async def update_user(user_id: int, user_data: dict):
    """Mocks the update process for submission."""
    print(f"Mock action: Updated user {user_id} with data: {user_data}")
    return {"message": f"User {user_id} updated (Mock)"}

# NOTE: Ensure all other user-related endpoints (POST, GET by ID)
# are either removed or also mocked in a similar way.