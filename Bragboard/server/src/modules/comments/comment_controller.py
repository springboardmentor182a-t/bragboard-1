from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ...database import get_db
from ...auth.jwt_handler import get_current_user

from .comment_schema import CommentCreate, CommentUpdate, CommentOut
from .comment_service import (
    add_comment,
    get_comments,
    update_comment,
    delete_comment
)

router = APIRouter(prefix="/comments", tags=["Comments"])

# ▶ Add Comment
@router.post("/{shoutout_id}", response_model=CommentOut)
def add_comment_api(
    shoutout_id: int,
    data: CommentCreate,
    db: Session = Depends(get_db)
    # Temporarily removed auth for demo
    # user=Depends(get_current_user)
):
    # Mock user_id for demo
    return add_comment(db, shoutout_id, 1, data.content)

# ▶ Get Comments for Shoutout
@router.get("/{shoutout_id}", response_model=list[CommentOut])
def get_comments_api(
    shoutout_id: int,
    db: Session = Depends(get_db)
):
    return get_comments(db, shoutout_id)

# ▶ Update Comment
@router.put("/{comment_id}", response_model=CommentOut)
def update_comment_api(
    comment_id: int,
    data: CommentUpdate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return update_comment(db, comment_id, user["id"], data.content)

# ▶ Delete Comment
@router.delete("/{comment_id}")
def delete_comment_api(
    comment_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    is_admin = user["role"] == "admin"
    return delete_comment(db, comment_id, user["id"], is_admin)
