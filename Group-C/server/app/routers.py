# server/app/routers.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from .database import get_session
from . import crud
from . import models
from typing import List

router = APIRouter()

@router.post("/shouts", response_model=models.ShoutRead, status_code=status.HTTP_201_CREATED)
def api_create_shout(shout_in: models.ShoutCreate, session: Session = Depends(get_session)):
    return crud.create_shout(session, shout_in)

@router.get("/shouts", response_model=List[models.ShoutRead])
def api_list_shouts(limit: int = 50, offset: int = 0, session: Session = Depends(get_session)):
    return crud.get_shouts(session, limit=limit, offset=offset)

@router.get("/shouts/{shout_id}", response_model=models.ShoutRead)
def api_get_shout(shout_id: int, session: Session = Depends(get_session)):
    shout = crud.get_shout(session, shout_id)
    if not shout:
        raise HTTPException(status_code=404, detail="Shout not found")
    return shout

@router.put("/shouts/{shout_id}", response_model=models.ShoutRead)
def api_update_shout(shout_id: int, shout_in: models.ShoutUpdate, session: Session = Depends(get_session)):
    shout = crud.update_shout(session, shout_id, shout_in)
    if not shout:
        raise HTTPException(status_code=404, detail="Shout not found")
    return shout

@router.delete("/shouts/{shout_id}", status_code=status.HTTP_204_NO_CONTENT)
def api_delete_shout(shout_id: int, session: Session = Depends(get_session)):
    ok = crud.delete_shout(session, shout_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Shout not found")
    return None
