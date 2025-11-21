from sqlalchemy.orm import Session
from src.shoutouts.models import Shoutout
from src.entities.shoutout import ShoutoutCreate, ShoutoutUpdate


def create_shoutout(db: Session, data: ShoutoutCreate):
    new_s = Shoutout(**data.dict())
    db.add(new_s)
    db.commit()
    db.refresh(new_s)
    return new_s


def get_shoutout(db: Session, shoutout_id: int):
    return db.query(Shoutout).filter(Shoutout.id == shoutout_id).first()


def get_all_shoutouts(db: Session):
    return db.query(Shoutout).all()


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
