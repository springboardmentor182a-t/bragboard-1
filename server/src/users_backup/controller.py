from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from src.database import async_get_db # Dependency to get the async DB session
from src.models import User # The SQLAlchemy ORM model
from pydantic import BaseModel
from typing import Optional

# -------------------------------------------------------------
# 1. Pydantic Schemas (For API Request/Response Validation)
# -------------------------------------------------------------

# Schema used for retrieving a list of users or a single user
class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str
    is_active: bool

    class Config:
        from_attributes = True # Allows mapping SQLAlchemy ORM model to Pydantic

# Schema used for updating a user (PUT request body)
class UserUpdate(BaseModel):
    role: Optional[str] = None
    is_active: Optional[bool] = None

# -------------------------------------------------------------
# 2. Router Definition
# -------------------------------------------------------------
router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

# -------------------------------------------------------------
# 3. Endpoints
# -------------------------------------------------------------

# GET /users (List all users)
@router.get("/", response_model=List[UserResponse])
async def list_users(db: AsyncSession = Depends(async_get_db)):
    """Fetches a list of all user records from PostgreSQL."""
    
    # Construct an asynchronous select statement
    statement = select(User) 
    result = await db.execute(statement)
    
    # Get all results and return
    users = result.scalars().all()
    
    return users

# GET /users/{id} (Get single user details)
@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: int, db: AsyncSession = Depends(async_get_db)):
    """Retrieves a single user record by ID."""
    
    # Construct statement to select a user by primary key (id)
    user = await db.get(User, user_id)
    
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
        
    return user

# PUT /users/{id} (Update user role or ban status)
@router.put("/{user_id}", response_model=UserResponse)
async def update_user(user_id: int, user_data: UserUpdate, db: AsyncSession = Depends(async_get_db)):
    """Updates the role and active status of a user."""
    
    # Get the existing user record
    db_user = await db.get(User, user_id)
    
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Update fields only if they were provided in the request body
    update_data = user_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_user, key, value)

    # Commit the changes to the database
    await db.commit()
    await db.refresh(db_user) # Refresh to get the latest data back
    
    return db_user

# DELETE /users/{id} (Delete user)
@router.delete("/{user_id}", status_code=204) # 204 No Content is standard for successful deletion
async def delete_user(user_id: int, db: AsyncSession = Depends(async_get_db)):
    """Deletes a user record."""
    
    # Get the user to ensure it exists before deleting
    user_to_delete = await db.get(User, user_id)
    
    if user_to_delete is None:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Delete the record
    await db.delete(user_to_delete)
    
    # Commit the transaction
    await db.commit()
    
    # Returns 204 status automatically
    return