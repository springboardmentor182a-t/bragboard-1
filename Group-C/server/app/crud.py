# server/app/crud.py
from sqlmodel import Session, select
from .models import Shout, ShoutCreate, ShoutUpdate
from typing import List, Optional

def create_shout(session: Session, shout_in: ShoutCreate) -> Shout:
    shout = Shout.from_orm(shout_in)
    session.add(shout)
    session.commit()
    session.refresh(shout)
    return shout

def get_shout(session: Session, shout_id: int) -> Optional[Shout]:
    return session.get(Shout, shout_id)

def get_shouts(session: Session, limit: int = 50, offset: int = 0) -> List[Shout]:
    statement = select(Shout).order_by(Shout.created_at.desc()).offset(offset).limit(limit)
    return session.exec(statement).all()

def update_shout(session: Session, shout_id: int, shout_in: ShoutUpdate) -> Optional[Shout]:
    shout = session.get(Shout, shout_id)
    if not shout:
        return None
    data = shout_in.dict(exclude_unset=True)
    for key, value in data.items():
        setattr(shout, key, value)
    session.add(shout)
    session.commit()
    session.refresh(shout)
    return shout

def delete_shout(session: Session, shout_id: int) -> bool:
    shout = session.get(Shout, shout_id)
    if not shout:
        return False
    session.delete(shout)
    session.commit()
    return True
