"""User service layer."""
from typing import List, Optional
from .models import User
from ..exceptions import NotFoundError

# Mock database (replace with actual database)
mock_users = [
    {"id": 1, "name": "John Doe", "email": "john@example.com", "status": "Active"},
    {"id": 2, "name": "Jane Smith", "email": "jane@example.com", "status": "Active"},
]


async def get_all_users() -> List[dict]:
    """Get all users."""
    return mock_users


async def get_user_by_id(user_id: int) -> dict:
    """
    Get user by ID.
    
    Args:
        user_id: User ID
        
    Returns:
        User data
        
    Raises:
        NotFoundError: If user not found
    """
    user = next((u for u in mock_users if u["id"] == user_id), None)
    if not user:
        raise NotFoundError("User not found")
    return user


async def create_user(user: User) -> dict:
    """
    Create new user.
    
    Args:
        user: User data
        
    Returns:
        Success message and user data
    """
    mock_users.append(user.dict())
    return {"message": "User created successfully", "user": user}


async def update_user(user_id: int, user: User) -> dict:
    """
    Update user.
    
    Args:
        user_id: User ID
        user: Updated user data
        
    Returns:
        Success message and user data
    """
    return {"message": "User updated successfully", "user": user}


async def delete_user(user_id: int) -> dict:
    """
    Delete user.
    
    Args:
        user_id: User ID
        
    Returns:
        Success message
    """
    return {"message": "User deleted successfully"}
