# server/app/routers/reactions.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..deps import get_db, get_current_user
from .. import crud, schemas, models

router = APIRouter(prefix="/reactions", tags=["reactions"])

@router.post("/")
def react(payload: schemas.ReactionCreate, db: Session = Depends(get_db), current: models.User = Depends(get_current_user)):
    post = crud.get_post(db, payload.post_id)
    if not post:
        raise HTTPException(404)
    r = crud.add_reaction(db, current.user_id, payload.post_id, payload.reaction_type)
    return {"ok": True, "reaction_id": r.reaction_id}

