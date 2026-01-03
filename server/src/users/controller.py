"""User controller (routes)."""
from fastapi import APIRouter
from typing import List
from .models import User
from .service import get_all_users, get_user_by_id, create_user, update_user, delete_user

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.get("", response_model=List[User])
async def get_users():
    """Get all users."""
    return await get_all_users()


@router.get("/{user_id}")
async def get_user(user_id: int):
    """Get user by ID."""
    return await get_user_by_id(user_id)


@router.post("")
async def create_new_user(user: User):
    """Create new user."""
    return await create_user(user)


@router.put("/{user_id}")
async def update_existing_user(user_id: int, user: User):
    """Update user."""
    return await update_user(user_id, user)


@router.delete("/{user_id}")
async def delete_existing_user(user_id: int):
    """Delete user."""
    return await delete_user(user_id)
