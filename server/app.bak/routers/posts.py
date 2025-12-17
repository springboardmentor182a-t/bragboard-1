# server/app/routers/posts.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..deps import get_db, get_current_user
from .. import schemas, crud, models

router = APIRouter(prefix="/posts", tags=["posts"])

@router.post("/", response_model=schemas.PostOut)
def create_post(payload: schemas.PostCreate, db: Session = Depends(get_db), current: models.User = Depends(get_current_user)):
    post = crud.create_post(db, current.user_id, payload)
    # notify mentioned users (recipients)
    for rid in payload.recipients or []:
        if rid != current.user_id:
            crud.create_notification(db, rid, "mention", f"{current.full_name} mentioned you in a post #{post.post_id}")
    return post

@router.get("/", response_model=list[schemas.PostOut])
def list_posts(limit: int = 50, offset: int = 0, db: Session = Depends(get_db)):
    return crud.list_posts(db, limit=limit, offset=offset)

@router.get("/{post_id}", response_model=schemas.PostOut)
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = crud.get_post(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.delete("/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db), current: models.User = Depends(get_current_user)):
    post = crud.get_post(db, post_id)
    if not post:
        raise HTTPException(404)
    # allow author or admin/moderator to delete
    if post.user_id != current.user_id and current.user_type not in (models.UserTypeEnum.admin, models.UserTypeEnum.moderator):
        raise HTTPException(403, "Not allowed")
    db.delete(post)
    db.commit()
    return {"ok": True}
