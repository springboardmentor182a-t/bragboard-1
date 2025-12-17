# server/app/crud.py
from sqlalchemy.orm import Session
from . import models, schemas
from passlib.context import CryptContext
from typing import Optional, List, Dict, Any
from sqlalchemy import func

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_ctx.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_ctx.verify(plain, hashed)

# Users
def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.email == email).first()

def get_user(db: Session, user_id: int) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.user_id == user_id).first()

def create_user(db: Session, user_in: schemas.UserCreate) -> models.User:
    user = models.User(
        username=user_in.username,
        full_name=user_in.full_name,
        user_type=user_in.user_type,
        email=user_in.email,
        password_hash=get_password_hash(user_in.password),
        department=user_in.department
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def admin_create_user(db: Session, payload: Dict[str, Any], creator_id: int) -> models.User:
    # payload expected to include: username, full_name, user_type, email, password, department
    u = models.User(
        username=payload["username"],
        full_name=payload["full_name"],
        user_type=payload.get("user_type", models.UserTypeEnum.user),
        email=payload["email"],
        password_hash=get_password_hash(payload["password"]),
        department=payload.get("department")
    )
    db.add(u)
    db.commit()
    db.refresh(u)

    # Only record activity if a valid creator_id was provided (non-empty and non-zero)
    try:
        if creator_id and creator_id != 0:
            log = models.UserActivityLog(
                user_id=creator_id,
                action_type="admin_create_user",
                description=f"Admin created user {u.user_id}"
            )
            db.add(log)
            db.commit()
    except Exception:
        # swallow logging errors to avoid crashing main flow; optionally log to stdout
        # (avoid raising here so seeding/startup doesn't fail if logging table constraints exist)
        pass

    return u


def update_user(db: Session, user_id: int, updates: Dict[str,Any]):
    u = get_user(db, user_id)
    if not u:
        return None
    for k,v in updates.items():
        if k == "password":
            setattr(u, "password_hash", get_password_hash(v))
        elif hasattr(u, k):
            setattr(u, k, v)
    db.add(u)
    db.commit()
    db.refresh(u)
    return u

def delete_user(db: Session, user_id: int):
    u = get_user(db, user_id)
    if not u:
        return False
    db.delete(u)
    db.commit()
    return True

def suspend_user(db: Session, user_id: int, suspend: bool = True):
    u = get_user(db, user_id)
    if not u:
        return None
    u.is_suspended = suspend
    db.add(u)
    db.commit()
    db.refresh(u)
    return u

# Posts
def create_post(db: Session, user_id: int, post_in: schemas.PostCreate):
    post = models.Post(user_id=user_id, description=post_in.description, image_url=post_in.image_url)
    db.add(post)
    db.commit()
    db.refresh(post)
    # tags
    for rid in post_in.recipients or []:
        tag = models.PostTag(post_id=post.post_id, user_id=rid)
        db.add(tag)
    db.commit()
    db.refresh(post)
    return post

def get_post(db: Session, post_id: int):
    return db.query(models.Post).filter(models.Post.post_id == post_id).first()

def list_posts(db: Session, limit: int = 50, offset: int = 0):
    return db.query(models.Post).order_by(models.Post.created_at.desc()).offset(offset).limit(limit).all()

# Reactions, comments and reports: add/remove simple functions with notifications
def add_reaction(db: Session, user_id: int, post_id: int, reaction_type: str):
    r = models.Reaction(user_id=user_id, post_id=post_id, reaction_type=reaction_type)
    db.add(r)
    db.commit()
    db.refresh(r)
    # create notification for post owner
    post = get_post(db, post_id)
    if post and post.user_id != user_id:
        create_notification(db, post.user_id, "reaction", f"{get_user(db, user_id).full_name} reacted ({reaction_type}) to your post #{post.post_id}")
    return r

def add_comment(db: Session, user_id: int, post_id: int, content: str):
    c = models.Comment(user_id=user_id, post_id=post_id, content=content)
    db.add(c)
    db.commit()
    db.refresh(c)
    post = get_post(db, post_id)
    if post and post.user_id != user_id:
        create_notification(db, post.user_id, "comment", f"{get_user(db, user_id).full_name} commented on your post #{post.post_id}: {content[:120]}")
    return c

def report_post(db: Session, user_id: int, post_id: int, reason: str):
    rp = models.ReportedPost(user_id=user_id, post_id=post_id, report_reason=reason)
    db.add(rp)
    db.commit()
    db.refresh(rp)
    return rp

# Notifications
def create_notification(db: Session, user_id: int, typ: str, content: str):
    n = models.Notification(user_id=user_id, type=typ, content=content)
    db.add(n)
    db.commit()
    db.refresh(n)
    return n

def list_notifications(db: Session, user_id: int, limit: int = 50, offset: int = 0):
    return db.query(models.Notification).filter(models.Notification.user_id == user_id).order_by(models.Notification.created_at.desc()).offset(offset).limit(limit).all()

def mark_notifications_read(db: Session, user_id: int, notification_ids: Optional[List[int]] = None):
    q = db.query(models.Notification).filter(models.Notification.user_id == user_id)
    if notification_ids:
        q = q.filter(models.Notification.notification_id.in_(notification_ids))
    q.update({"is_read": True})
    db.commit()
    return True

def unread_count(db: Session, user_id: int) -> int:
    return db.query(models.Notification).filter(models.Notification.user_id == user_id, models.Notification.is_read == False).count()

# Analytics helpers
def top_contributors(db: Session, limit: int = 10):
    # sums of reactions received by user
    q = db.query(models.User.user_id, models.User.full_name, func.count(models.Reaction.reaction_id).label("reactions"))\
          .join(models.Post, models.Post.user_id == models.User.user_id)\
          .join(models.Reaction, models.Reaction.post_id == models.Post.post_id)\
          .group_by(models.User.user_id, models.User.full_name)\
          .order_by(func.count(models.Reaction.reaction_id).desc())\
          .limit(limit)
    return q.all()

def reaction_stats(db: Session):
    q = db.query(models.Reaction.reaction_type, func.count(models.Reaction.reaction_id)).group_by(models.Reaction.reaction_type).all()
    return {r[0]: r[1] for r in q}

def department_engagement(db: Session):
    # reactions per department
    q = db.query(models.User.department, func.count(models.Reaction.reaction_id).label("reactions"))\
          .join(models.Reaction, models.Reaction.user_id == models.User.user_id)\
          .group_by(models.User.department)\
          .order_by(func.count(models.Reaction.reaction_id).desc())
    return q.all()

def reported_posts_count(db: Session):
    return db.query(models.ReportedPost).count()

def active_users(db: Session, days: int = 30):
    # users who made posts/comments/reactions in last `days`
    from datetime import datetime, timedelta
    cutoff = datetime.utcnow() - timedelta(days=days)
    q_posts = db.query(models.Post.user_id).filter(models.Post.created_at >= cutoff)
    q_comments = db.query(models.Comment.user_id).filter(models.Comment.created_at >= cutoff)
    q_reacts = db.query(models.Reaction.user_id).filter(models.Reaction.created_at >= cutoff)
    union_q = q_posts.union(q_comments, q_reacts).distinct()
    return union_q.count()
