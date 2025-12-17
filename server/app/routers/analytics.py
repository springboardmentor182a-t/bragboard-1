# server/app/routers/analytics.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..deps import get_db, get_current_user
from .. import crud, models

router = APIRouter(prefix="/analytics", tags=["analytics"])

def require_admin(user: models.User):
    if user.user_type != models.UserTypeEnum.admin:
        raise HTTPException(status_code=403, detail="Admin required")

@router.get("/top-contributors")
def top_contributors(limit: int = 10, db: Session = Depends(get_db), current: models.User = Depends(get_current_user)):
    require_admin(current)
    rows = crud.top_contributors(db, limit=limit)
    return [{"user_id": r[0], "full_name": r[1], "reactions": r[2]} for r in rows]

@router.get("/reaction-stats")
def reaction_stats(db: Session = Depends(get_db), current: models.User = Depends(get_current_user)):
    # any logged in user can view
    return crud.reaction_stats(db)

@router.get("/department-engagement")
def department_engagement(db: Session = Depends(get_db), current: models.User = Depends(get_current_user)):
    require_admin(current)
    rows = crud.department_engagement(db)
    return [{"department": r[0], "reactions": r[1]} for r in rows]

@router.get("/reported-count")
def reported_count(db: Session = Depends(get_db), current: models.User = Depends(get_current_user)):
    require_admin(current)
    return {"reported_posts": crud.reported_posts_count(db)}

@router.get("/active-users")
def active_users(days: int = 30, db: Session = Depends(get_db), current: models.User = Depends(get_current_user)):
    require_admin(current)
    return {"active_users": crud.active_users(db, days=days)}

