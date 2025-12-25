<<<<<<< HEAD
from sqlalchemy.orm import Session
from entities.comments import Comment
from .schemas import CommentCreate, CommentUpdate
from datetime import datetime

def create_comment(db: Session, shoutout_id: int, user_id: int, comment: CommentCreate):
    db_comment = Comment(shoutout_id=shoutout_id, user_id=user_id, content=comment.content)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

def get_comments(db: Session, shoutout_id: int):
    return db.query(Comment).filter(Comment.shoutout_id == shoutout_id).all()

def get_comment(db: Session, comment_id: int):
    return db.query(Comment).filter(Comment.id == comment_id).first()

def update_comment(db: Session, db_comment: Comment, update: CommentUpdate):
    db_comment.content = update.content
    db_comment.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_comment)
    return db_comment

def delete_comment(db: Session, db_comment: Comment):
    db.delete(db_comment)
    db.commit()

=======
from sqlalchemy.orm import Session
from entities.comments import Comment
from .schemas import CommentCreate, CommentUpdate
from datetime import datetime

def create_comment(db: Session, shoutout_id: int, user_id: int, comment: CommentCreate):
    db_comment = Comment(shoutout_id=shoutout_id, user_id=user_id, content=comment.content)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

def get_comments(db: Session, shoutout_id: int):
    return db.query(Comment).filter(Comment.shoutout_id == shoutout_id).all()

def get_comment(db: Session, comment_id: int):
    return db.query(Comment).filter(Comment.id == comment_id).first()

def update_comment(db: Session, db_comment: Comment, update: CommentUpdate):
    db_comment.content = update.content
    db_comment.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_comment)
    return db_comment

def delete_comment(db: Session, db_comment: Comment):
    db.delete(db_comment)
    db.commit()

>>>>>>> 3e2424c214281832d92a15cbeb86496329d2c772
