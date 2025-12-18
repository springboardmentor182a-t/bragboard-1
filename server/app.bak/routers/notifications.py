# server/app/routers/notifications.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..deps import get_db, get_current_user
from .. import crud, schemas

router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.get("/")
def get_notifications(limit: int = 50, offset: int = 0, db: Session = Depends(get_db), current = Depends(get_current_user)):
    items = crud.list_notifications(db, current.user_id, limit=limit, offset=offset)
    # simple serialization
    return [{"notification_id": n.notification_id, "type": n.type.value if n.type else None, "content": n.content, "is_read": n.is_read, "created_at": n.created_at} for n in items]

@router.post("/mark-read")
def mark_read(notification_ids: list[int] = None, db: Session = Depends(get_db), current = Depends(get_current_user)):
    crud.mark_notifications_read(db, current.user_id, notification_ids)
    return {"ok": True}

@router.get("/unread-count")
def unread_count(db: Session = Depends(get_db), current = Depends(get_current_user)):
    return {"unread": crud.unread_count(db, current.user_id)}
