from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from src.models.reaction import Reaction
from src.schemas.reaction import ReactionCreate
from src.dependencies import get_db, get_current_user

router = APIRouter(
    prefix="/api/shoutouts/{shoutout_id}/reactions",
    tags=["Reactions"]
)

@router.post("")
def add_or_update_reaction(
    shoutout_id: int,
    data: ReactionCreate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    reaction = db.query(Reaction).filter(
        Reaction.shoutout_id == shoutout_id,
        Reaction.user_id == user["id"]
    ).first()

    if reaction:
        reaction.type = data.type
    else:
        reaction = Reaction(
            shoutout_id=shoutout_id,
            user_id=user["id"],
            type=data.type
        )
        db.add(reaction)

    db.commit()
    return {"message": "Reaction saved", "type": data.type}


@router.delete("")
def remove_reaction(
    shoutout_id: int,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    reaction = db.query(Reaction).filter(
        Reaction.shoutout_id == shoutout_id,
        Reaction.user_id == user["id"]
    ).first()

    if not reaction:
        raise HTTPException(404, "Reaction not found")

    db.delete(reaction)
    db.commit()
    return {"message": "Reaction removed"}


@router.get("")
def get_reactions(
    shoutout_id: int,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    counts = db.query(
        Reaction.type,
        func.count(Reaction.id)
    ).filter(
        Reaction.shoutout_id == shoutout_id
    ).group_by(Reaction.type).all()

    user_reaction = db.query(Reaction).filter(
        Reaction.shoutout_id == shoutout_id,
        Reaction.user_id == user["id"]
    ).first()

    return {
        "counts": {c[0]: c[1] for c in counts},
        "user_reaction": user_reaction.type if user_reaction else None
    }
