from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.entities.shoutout import (
    ShoutoutCreate,
    ShoutoutResponse,
    ShoutoutUpdate
)
from src.database.core import get_db
from src.shoutouts.service import (
    create_shoutout,
    get_shoutout,
    get_all_shoutouts,
    update_shoutout,
    delete_shoutout
)

router = APIRouter(prefix="/shoutouts", tags=["Shoutouts"])


@router.post("/", response_model=ShoutoutResponse)
def create(data: ShoutoutCreate, db: Session = Depends(get_db)):
    return create_shoutout(db, data)


@router.get("/{shoutout_id}", response_model=ShoutoutResponse)
def read(shoutout_id: int, db: Session = Depends(get_db)):
    s = get_shoutout(db, shoutout_id)
    if not s:
        raise HTTPException(status_code=404, detail="Shoutout not found")
    return s


@router.get("/", response_model=list[ShoutoutResponse])
def read_all(db: Session = Depends(get_db)):
    return get_all_shoutouts(db)


@router.put("/{shoutout_id}", response_model=ShoutoutResponse)
def update(shoutout_id: int, data: ShoutoutUpdate, db: Session = Depends(get_db)):
    s = update_shoutout(db, shoutout_id, data)
    if not s:
        raise HTTPException(status_code=404, detail="Shoutout not found")
    return s


@router.delete("/{shoutout_id}")
def delete(shoutout_id: int, db: Session = Depends(get_db)):
    s = delete_shoutout(db, shoutout_id)
    if not s:
        raise HTTPException(status_code=404, detail="Shoutout not found")
    return s
