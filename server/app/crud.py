# server/app/crud.py
from sqlalchemy.orm import Session
from . import models, schemas
from passlib.context import CryptContext
from typing import Optional, List, Dict, Any, Union
from sqlalchemy import func
from datetime import datetime

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_ctx.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_ctx.verify(plain, hashed)

# --- Helpers ---
def _iso(dt: Optional[datetime]) -> Optional[str]:
    if dt is None:
        return None
    if isinstance(dt, str):
        return dt
    # datetime -> ISO string
    try:
        return dt.isoformat()
    except Exception:
        return str(dt)

def _post_to_dict(post: models.Post) -> Dict[str, Any]:
    """
    Convert a Post SQLAlchemy object to a dict that matches schemas.PostOut:
    - post_id, user_id, description, image_url, created_at (as str)
    - also include tagged_users: list[str] of usernames (or full_name fallback)
    """
    # gather tagged users for this post (if PostTag model exists)
    tagged_users_list = []
    try:
        # PostTag model expected to have user_id and there is a User model with username/full_name
        tags = getattr(post, "tags", None)  # if relationship is configured as `tags`
        if tags is None:
            # fallback: query PostTag table
            from sqlalchemy.orm import object_session
            db = object_session(post)
            if db is not None:
                tags = db.query(models.PostTag).filter(models.PostTag.post_id == getattr(post, "post_id", None)).all()
        if tags:
            for t in tags:
                # if relationship returns PostTag object with user attr
                u = getattr(t, "user", None)
                if u:
                    tagged_users_list.append(u.username or u.full_name or str(getattr(u, "user_id", "")))
                else:
                    # if PostTag has user_id only, fetch user
                    uid = getattr(t, "user_id", None)
                    if uid:
                        user_obj = db.query(models.User).filter(models.User.user_id == uid).first() if db is not None else None
                        if user_obj:
                            tagged_users_list.append(user_obj.username or user_obj.full_name or str(uid))
                        else:
                            tagged_users_list.append(str(uid))
    except Exception:
        # safety: if any of that fails, ignore and leave list empty
        try:
            # If there is a post.tagged_usernames attribute (some projects keep precomputed list)
            pre = getattr(post, "tagged_usernames", None)
            if pre:
                tagged_users_list = list(pre)
        except Exception:
            pass

    return {
        "post_id": getattr(post, "post_id", None),
        "user_id": getattr(post, "user_id", None),
        "description": getattr(post, "description", None),
        "image_url": getattr(post, "image_url", None),
        "created_at": _iso(getattr(post, "created_at", None)),
        # add snake_case key for frontend flexibility
        "tagged_users": tagged_users_list,
        # also include camelCase alias for older clients
        "taggedUsers": tagged_users_list,
    }

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
def create_post(db: Session, user_id: int, post_in: schemas.PostCreate) -> Dict[str, Any]:
    """
    Creates a post, persists PostTag entries from recipients (ids) and tags (usernames),
    and returns a dict with tagged_users (list of username strings).
    """
    post = models.Post(user_id=user_id, description=post_in.description, image_url=post_in.image_url)
    db.add(post)
    db.commit()
    db.refresh(post)

    # 1) Handle recipients that are numeric IDs (existing behavior)
    for rid in (post_in.recipients or []):
        try:
            # assume rid is an int user_id
            tag = models.PostTag(post_id=post.post_id, user_id=int(rid))
            db.add(tag)
        except Exception:
            # skip invalid values
            continue
    db.commit()
    db.refresh(post)

    # 2) Handle tags (usernames) - resolve to users and create PostTag rows
    # This allows frontend to send tags: ["ikhan0124", "sarah"]
    for username in (getattr(post_in, "tags", None) or []):
        uname = str(username).strip().lstrip("@")
        if not uname:
            continue
        user_obj = db.query(models.User).filter(
            (models.User.username == uname) | (models.User.full_name == uname)
        ).first()
        if user_obj:
            # avoid duplicate PostTag if already created
            exists = db.query(models.PostTag).filter(models.PostTag.post_id == post.post_id, models.PostTag.user_id == user_obj.user_id).first()
            if not exists:
                db.add(models.PostTag(post_id=post.post_id, user_id=user_obj.user_id))
    db.commit()
    db.refresh(post)

    # After tags created, build tagged_users list (username strings)
    tagged_usernames = []
    try:
        tags = db.query(models.PostTag).filter(models.PostTag.post_id == post.post_id).all()
        for t in tags:
            u = db.query(models.User).filter(models.User.user_id == t.user_id).first()
            if u:
                tagged_usernames.append(u.username or u.full_name or str(u.user_id))
            else:
                tagged_usernames.append(str(t.user_id))
    except Exception:
        pass

    result = _post_to_dict(post)
    result["tagged_users"] = tagged_usernames
    result["taggedUsers"] = tagged_usernames
    return result


def get_post(db: Session, post_id: int) -> Optional[Dict[str, Any]]:
    p = db.query(models.Post).filter(models.Post.post_id == post_id).first()
    if not p:
        return None
    return _post_to_dict(p)

def get_post_model(db: Session, post_id: int) -> Optional[models.Post]:
    """
    Return the SQLAlchemy model instance for a post (used when you want to delete or update the model).
    """
    return db.query(models.Post).filter(models.Post.post_id == post_id).first()

def delete_post(db: Session, post_id: int) -> bool:
    """
    Delete the post model instance. Return True if deleted, False if not found.
    """
    post = get_post_model(db, post_id)
    if not post:
        return False
    db.delete(post)
    db.commit()
    return True

def list_posts(db: Session, limit: int = 50, offset: int = 0) -> List[Dict[str, Any]]:
    posts = db.query(models.Post).order_by(models.Post.created_at.desc()).offset(offset).limit(limit).all()
    out = []
    for p in posts:
        d = _post_to_dict(p)
        out.append(d)
    return out

# Reactions, comments and reports: add/remove simple functions with notifications
def add_reaction(db: Session, user_id: int, post_id: int, reaction_type: str):
    r = models.Reaction(user_id=user_id, post_id=post_id, reaction_type=reaction_type)
    db.add(r)
    db.commit()
    db.refresh(r)
    # create notification for post owner
    post = db.query(models.Post).filter(models.Post.post_id == post_id).first()
    if post and post.user_id != user_id:
        usr = get_user(db, user_id)
        actor_name = usr.full_name if usr else "Someone"
        create_notification(db, post.user_id, "reaction", f"{actor_name} reacted ({reaction_type}) to your post #{post.post_id}")
    return r

def add_comment(db: Session, user_id: int, post_id: int, content: str):
    c = models.Comment(user_id=user_id, post_id=post_id, content=content)
    db.add(c)
    db.commit()
    db.refresh(c)
    post = db.query(models.Post).filter(models.Post.post_id == post_id).first()
    if post and post.user_id != user_id:
        usr = get_user(db, user_id)
        actor_name = usr.full_name if usr else "Someone"
        create_notification(db, post.user_id, "comment", f"{actor_name} commented on your post #{post.post_id}: {content[:120]}")
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
