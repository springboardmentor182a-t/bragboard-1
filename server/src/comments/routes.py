from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import update
from sqlalchemy.orm import Session
from entities.comments import Comment
from database import get_db
from . import schemas, crud
from typing import List

router = APIRouter(prefix="/shoutouts")


@router.post("/{shoutout_id}/comments", response_model=schemas.CommentRead, status_code=201)
def add_comment(shoutout_id: int, comment: schemas.CommentCreate, db: Session = Depends(get_db)):
    return crud.create_comment(db, shoutout_id, comment.user_id, comment)

@router.get("/{shoutout_id}/comments", response_model=List[schemas.CommentRead])
def list_comments(shoutout_id: int, db: Session = Depends(get_db)):
    return crud.get_comments(db, shoutout_id)

@router.get("/comments/{comment_id}", response_model=schemas.CommentRead)
def view_comment(comment_id: int, db: Session = Depends(get_db)):
    comment = crud.get_comment(db, comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    return comment

@router.patch("/comments/{comment_id}", response_model=schemas.CommentRead)
def edit_comment(comment_id: int, update: schemas.CommentUpdate, db: Session = Depends(get_db)):
    comment = crud.get_comment(db, comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    # Check authorization (user_id in request must match comment owner)
    if comment.user_id != update.user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    return crud.update_comment(db, comment, update)


@router.delete("/comments/{comment_id}", status_code=204)
def remove_comment(comment_id: int, user_id: int, db: Session = Depends(get_db)):
    comment = crud.get_comment(db, comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    # Check authorization (user_id in request must match comment owner)
    if comment.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    crud.delete_comment(db, comment)
    return None
