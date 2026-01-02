from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from src.database import get_db
from src.database import get_db
from src.utils.jwt_handler import get_current_user
from src.auth.auth import admin_required
from src.models import User
from src.auth.schemas import UserOut

router = APIRouter(prefix="/users", tags=["User Management"])

@router.get("/", response_model=List[UserOut])
def get_all_users(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    admin: User = Depends(admin_required)
):
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@router.get("/{user_id}", response_model=UserOut)
def get_user(
    user_id: int, 
    db: Session = Depends(get_db),
    admin: User = Depends(admin_required)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Basic update - extend schema as needed for partial updates
from src.auth.schemas import UserOut, UserUpdate

# ... imports ...

@router.put("/{user_id}", response_model=UserOut)
def update_user(
    user_id: int, 
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(admin_required)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user_update.role:
        if user_update.role not in ["employee", "admin"]:
            raise HTTPException(status_code=400, detail="Invalid role")
        user.role = user_update.role
        
    if user_update.department:
        user.department = user_update.department
        
    if user_update.name:
        user.name = user_update.name

    db.commit()
    db.refresh(user)
    return user
