from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database import get_db
from src.database import get_db
from src.auth.utils import hash_password, verify_password
from src.utils.jwt_handler import get_current_user
from src.models import User
from src.auth.schemas import UserOut
from pydantic import BaseModel

class PasswordChange(BaseModel):
    old_password: str
    new_password: str

class ProfileUpdate(BaseModel):
    name: str = None
    department: str = None

router = APIRouter(prefix="/settings", tags=["Settings"])

@router.put("/password")
def change_password(
    data: PasswordChange,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not verify_password(data.old_password, current_user.password):
        raise HTTPException(status_code=400, detail="Incorrect old password")
    
    current_user.password = hash_password(data.new_password)
    db.commit()
    return {"message": "Password updated successfully"}

@router.put("/profile", response_model=UserOut)
def update_profile(
    data: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if data.name:
        current_user.name = data.name
    if data.department:
        current_user.department = data.department
        
    db.commit()
    db.refresh(current_user)
    return current_user
