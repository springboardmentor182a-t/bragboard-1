from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from .comment_model import Comment

def add_comment(db: Session, shoutout_id: int, user_id: int, content: str):
    comment = Comment(shoutout_id=shoutout_id, user_id=user_id, content=content)
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment

def get_comments(db: Session, shoutout_id: int):
    return db.query(Comment).filter(Comment.shoutout_id == shoutout_id).all()

def update_comment(db: Session, comment_id: int, user_id: int, content: str):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()

    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    if comment.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not allowed to edit this comment")

    comment.content = content
    db.commit()
    db.refresh(comment)
    return comment

def delete_comment(db: Session, comment_id: int, user_id: int, is_admin: bool):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    if not is_admin and comment.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not allowed to delete this comment")

    db.delete(comment)
    db.commit()
    return {"message": "Comment deleted"}
