from sqlalchemy.orm import Session
from sqlalchemy.orm.attributes import flag_modified
from ..models.shoutout import Shoutout
from ..schemas.shoutout import ShoutoutCreate

def get_shoutouts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Shoutout).offset(skip).limit(limit).all()

def create_shoutout_func(db: Session, shoutout: ShoutoutCreate):
    db_shoutout = Shoutout(**shoutout.dict())
    db.add(db_shoutout)
    db.commit()
    db.refresh(db_shoutout)
    return db_shoutout

def react_to_shoutout(db: Session, shoutout_id: int, reaction_type: str):
    shoutout = db.query(Shoutout).filter(Shoutout.id == shoutout_id).first()
    if not shoutout:
        return None

    # ensure dict
    if not isinstance(shoutout.reactions, dict):
        shoutout.reactions = {"like": 0, "love": 0, "laugh": 0}

    if reaction_type not in shoutout.reactions:
        shoutout.reactions[reaction_type] = 0

    shoutout.reactions[reaction_type] += 1

    # tell SQLAlchemy JSON changed
    flag_modified(shoutout, "reactions")
    db.add(shoutout)
    db.commit()
    db.refresh(shoutout)
    return shoutout
