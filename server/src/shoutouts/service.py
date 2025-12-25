from sqlalchemy.orm import Session
from .models import Shoutout
from entities.shoutout import ShoutoutCreate, ShoutoutUpdate


def create_shoutout(db: Session, data: ShoutoutCreate):
    new_s = Shoutout(**data.dict())
    db.add(new_s)
    db.commit()
    db.refresh(new_s)
    return new_s


def get_shoutout(db: Session, shoutout_id: int):
    return db.query(Shoutout).filter(Shoutout.id == shoutout_id).first()


def get_all_shoutouts(db: Session):
    # By default return only non-deleted shoutouts
    return db.query(Shoutout).filter(Shoutout.is_deleted == False).all()


def get_all_shoutouts_paginated(db: Session, page: int, page_size: int, include_deleted: bool = False):
    offset = (page - 1) * page_size
    base_query = db.query(Shoutout)
    if not include_deleted:
        base_query = base_query.filter(Shoutout.is_deleted == False)
    total = base_query.count()
    items = base_query.offset(offset).limit(page_size).all()
    return items, total


def update_shoutout(db: Session, shoutout_id: int, data: ShoutoutUpdate):
    s = get_shoutout(db, shoutout_id)
    if not s:
        return None

    for field, value in data.dict(exclude_unset=True).items():
        setattr(s, field, value)

    db.commit()
    db.refresh(s)
    return s


def delete_shoutout(db: Session, shoutout_id: int):
    s = get_shoutout(db, shoutout_id)
    if not s:
        return None

    db.delete(s)
    db.commit()
    return {"deleted": True}


def soft_delete_shoutout(db: Session, shoutout_id: int):
    s = get_shoutout(db, shoutout_id)
    if not s:
        return None
    from datetime import datetime

    s.is_deleted = True
    s.deleted_at = datetime.utcnow()
    db.commit()
    db.refresh(s)
    return s


def restore_shoutout(db: Session, shoutout_id: int):
    s = get_shoutout(db, shoutout_id)
    if not s:
        return None

    s.is_deleted = False
    s.deleted_at = None
    db.commit()
    db.refresh(s)
    return s
