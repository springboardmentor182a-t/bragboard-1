from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..crud.shoutout import get_shoutouts, create_shoutout_func, react_to_shoutout
from ..schemas.shoutout import Shoutout, ShoutoutCreate
from ..database import get_db

router = APIRouter(prefix="/shoutouts", tags=["shoutouts"])

@router.get("/", response_model=list[Shoutout])
def read_shoutouts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_shoutouts(db, skip=skip, limit=limit)

@router.post("/", response_model=Shoutout)
def create_new_shoutout(shoutout: ShoutoutCreate, db: Session = Depends(get_db)):
    return create_shoutout_func(db=db, shoutout=shoutout)

@router.post("/{shoutout_id}/reaction/{reaction_type}", response_model=Shoutout)
def add_reaction(shoutout_id: int, reaction_type: str, db: Session = Depends(get_db)):
    shoutout_updated = react_to_shoutout(db, shoutout_id, reaction_type)
    if not shoutout_updated:
        raise HTTPException(status_code=404, detail="Shoutout not found")
    return shoutout_updated
