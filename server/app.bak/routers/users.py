# server/app/routers/users.py
from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from .. import schemas, crud, models
from ..deps import get_db, get_current_user
from typing import List
from pydantic import BaseModel

router = APIRouter(prefix="/users", tags=["users"])

def require_admin(user: models.User):
    if user.user_type != models.UserTypeEnum.admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin required")

@router.get("/", response_model=List[schemas.UserOut])
def list_users(db: Session = Depends(get_db), current: models.User = Depends(get_current_user)):
    require_admin(current)
    users = db.query(models.User).all()
    return users

@router.get("/me", response_model=schemas.UserOut)
def read_me(current: models.User = Depends(get_current_user)):
    return current

@router.put("/me", response_model=schemas.UserOut)
def update_me(payload: schemas.UserOut, db: Session = Depends(get_db), current: models.User = Depends(get_current_user)):
    u = db.query(models.User).filter(models.User.user_id == current.user_id).first()
    if not u:
        raise HTTPException(404)
    u.full_name = payload.full_name or u.full_name
    u.department = payload.department or u.department
    u.bio = payload.bio or u.bio
    u.profile_picture_url = payload.profile_picture_url or u.profile_picture_url
    db.add(u)
    db.commit()
    db.refresh(u)
    return u

# Admin create user
class AdminCreateUser(BaseModel):
    username: str
    full_name: str
    user_type: models.UserTypeEnum
    email: str
    password: str
    department: str | None = None

@router.post("/", response_model=schemas.UserOut)
def admin_create_user(payload: AdminCreateUser, db: Session = Depends(get_db), current: models.User = Depends(get_current_user)):
    require_admin(current)
    u = crud.admin_create_user(db, payload.dict(), current.user_id)
    return u

@router.delete("/{user_id}")
def admin_delete_user(user_id: int, db: Session = Depends(get_db), current: models.User = Depends(get_current_user)):
    require_admin(current)
    ok = crud.delete_user(db, user_id)
    if not ok:
        raise HTTPException(404, "User not found")
    return {"ok": True}

@router.put("/{user_id}")
def admin_update_user(user_id: int, updates: dict = Body(...), db: Session = Depends(get_db), current: models.User = Depends(get_current_user)):
    require_admin(current)
    u = crud.update_user(db, user_id, updates)
    if not u:
        raise HTTPException(404, "User not found")
    return u

@router.post("/{user_id}/suspend")
def admin_suspend_user(user_id: int, suspend: bool = True, db: Session = Depends(get_db), current: models.User = Depends(get_current_user)):
    require_admin(current)
    u = crud.suspend_user(db, user_id, suspend)
    if not u:
        raise HTTPException(404, "User not found")
    return {"ok": True, "suspended": u.is_suspended}
