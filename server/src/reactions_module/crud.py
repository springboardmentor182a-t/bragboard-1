from sqlalchemy.orm import Session
from sqlalchemy import func
from .models import Reaction
from .schemas import ReactionCreate, ReactionCount

ALLOWED_REACTIONS = {"like", "love", "laugh"}

def add_or_toggle_reaction(db: Session, data: ReactionCreate) -> ReactionCount:
    if data.reaction_type not in ALLOWED_REACTIONS:
        raise ValueError("Invalid reaction type")

    # check if same user already reacted with same type
    existing = (
        db.query(Reaction)
        .filter(
            Reaction.parent_type == data.parent_type,
            Reaction.parent_id == data.parent_id,
            Reaction.user_id == data.user_id,
            Reaction.reaction_type == data.reaction_type,
        )
        .first()
    )

    if existing:
        # toggle off
        db.delete(existing)
    else:
        # add new
        db.add(Reaction(**data.dict()))

    db.commit()

    # return updated counts
    rows = (
        db.query(Reaction.reaction_type, func.count(Reaction.id))
        .filter(
            Reaction.parent_type == data.parent_type,
            Reaction.parent_id == data.parent_id,
        )
        .group_by(Reaction.reaction_type)
        .all()
    )
    counts = {r[0]: r[1] for r in rows}
    return ReactionCount(parent_type=data.parent_type, parent_id=data.parent_id, counts=counts)

def get_counts(db: Session, parent_type: str, parent_id: int) -> ReactionCount:
    rows = (
        db.query(Reaction.reaction_type, func.count(Reaction.id))
        .filter(
            Reaction.parent_type == parent_type,
            Reaction.parent_id == parent_id,
        )
        .group_by(Reaction.reaction_type)
        .all()
    )
    counts = {r[0]: r[1] for r in rows}
    return ReactionCount(parent_type=parent_type, parent_id=parent_id, counts=counts)
