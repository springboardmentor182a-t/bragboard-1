from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc
from typing import List

from src.core import get_db
from src.entities_user import User
from src.entities.comment import Comment
from src.entities.shoutout import ShoutOut
from src.schemas_comments import CommentCreate, CommentUpdate, CommentResponse, UserInfo
from src.auth_service import get_current_user

# ---------------------- ROUTERS ----------------------

# Router for shoutout-related comment endpoints
shoutout_comments_router = APIRouter(
    prefix="/shoutouts",
    tags=["Comments"]
)

# Router for comment-specific endpoints (update/delete)
comments_router = APIRouter(
    prefix="/comments",
    tags=["Comments"]
)

# ---------------------- ENDPOINTS ----------------------

@shoutout_comments_router.post("/{shoutout_id}/comments", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
async def create_comment(
    shoutout_id: int,
    comment_data: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new comment on a shoutout."""

    shoutout = db.query(ShoutOut).filter(ShoutOut.id == shoutout_id).first()
    if not shoutout:
        raise HTTPException(status_code=404, detail="Shoutout not found")

    new_comment = Comment(
        content=comment_data.content,
        user_id=current_user.id,
        shoutout_id=shoutout_id
    )

    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)

    return CommentResponse(
        id=new_comment.id,
        content=new_comment.content,
        created_at=new_comment.created_at,
        user=UserInfo(id=current_user.id, name=current_user.name)
    )


@shoutout_comments_router.get("/{shoutout_id}/comments", response_model=List[CommentResponse])
async def get_comments(
    shoutout_id: int,
    db: Session = Depends(get_db)
):
    """Get all comments for a shoutout, sorted by newest first."""

    shoutout = db.query(ShoutOut).filter(ShoutOut.id == shoutout_id).first()
    if not shoutout:
        raise HTTPException(status_code=404, detail="Shoutout not found")

    comments = db.query(Comment).options(
        joinedload(Comment.user)
    ).filter(
        Comment.shoutout_id == shoutout_id
    ).order_by(desc(Comment.created_at)).all()

    return [
        CommentResponse(
            id=c.id,
            content=c.content,
            created_at=c.created_at,
            user=UserInfo(id=c.user.id, name=c.user.name)
        )
        for c in comments
    ]


@comments_router.put("/{comment_id}", response_model=CommentResponse)
async def update_comment(
    comment_id: int,
    comment_data: CommentUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a comment."""

    comment = db.query(Comment).options(joinedload(Comment.user)).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    if comment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only edit your own comments")

    comment.content = comment_data.content
    db.commit()

    return CommentResponse(
        id=comment.id,
        content=comment.content,
        created_at=comment.created_at,
        user=UserInfo(id=comment.user.id, name=comment.user.name)
    )


@comments_router.delete("/{comment_id}")
async def delete_comment(
    comment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a comment."""

    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    if comment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only delete your own comments")

    db.delete(comment)
    db.commit()

    return {"message": "comment_deleted"}

# ---------------------- EXPORT ROUTERS ----------------------

# This "router" is what api.py will import
router = [shoutout_comments_router, comments_router]
