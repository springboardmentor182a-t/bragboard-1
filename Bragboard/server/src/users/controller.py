from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from src.database import get_db
from src.database import get_db
from src.utils.jwt_handler import get_current_user
from src.auth.auth import admin_required, employee_required
from src.models import User
from src.auth.schemas import UserOut

router = APIRouter(prefix="/users", tags=["User Management"])

@router.get("/", response_model=List[UserOut])
def get_all_users(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: any = Depends(employee_required)
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

@router.delete("/{user_id}", status_code=204)
def delete_user(
    user_id: int, 
    db: Session = Depends(get_db),
    admin: User = Depends(admin_required)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Manual Cascade Deletion
    from src.models import Shoutout, Comment, Reaction, ShoutoutRecipient, Leaderboard, Report
    
    # 1. Delete Leaderboard entry
    db.query(Leaderboard).filter(Leaderboard.user_id == user_id).delete()
    
    # 2. Delete Reactions made by user
    db.query(Reaction).filter(Reaction.user_id == user_id).delete()
    
    # 3. Delete Comments made by user
    db.query(Comment).filter(Comment.user_id == user_id).delete()
    
    # 4. Delete Shoutout Recipients (where user was tagged)
    db.query(ShoutoutRecipient).filter(ShoutoutRecipient.recipient_id == user_id).delete()
    
    # 5. Delete Reports made by user (or where user is resolved_by - might fail if nullable is False, checking model shows nullable=True for resolved_by, False for reported_by)
    db.query(Report).filter(Report.reported_by == user_id).delete()
    
    # 6. Delete Shoutouts sent by user (this cascades to reactions/comments on those shoutouts via SQLAlchemy relationship if loaded, but here we do raw delete, so we should check)
    # Actually, Shoutout model has cascade="all, delete-orphan" for comments/reactions, so deleting Shoutout object via ORM handles it.
    # But db.query().delete() is bulk delete and might skip ORM cascades. 
    # Let's iterate and delete to ensure ORM cascades trigger, or manually delete their children.
    # Safer to iterate for Shoutouts to ensure their children are gone.
    user_shoutouts = db.query(Shoutout).filter(Shoutout.sender_id == user_id).all()
    for s in user_shoutouts:
        db.delete(s)
        
    # 7. Finally Delete User
    db.delete(user)
    db.commit()
    return None
