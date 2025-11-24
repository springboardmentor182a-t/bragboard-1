from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict

from src.core import get_db
from src.entities_user import User
from src.entities.reaction import Reaction
from src.entities.shoutout import ShoutOut
from src.schemas_reactions import ReactionCreate, ReactionResponse, ReactionCounts
from src.auth_service import get_current_user


router = APIRouter(
    prefix="/shoutouts",
    tags=["Reactions"]
)


def get_reaction_counts(db: Session, shoutout_id: int) -> Dict[str, int]:
    """Helper function to get reaction counts for a shoutout."""
    counts = db.query(
        Reaction.type,
        func.count(Reaction.id).label('count')
    ).filter(
        Reaction.shoutout_id == shoutout_id
    ).group_by(Reaction.type).all()
    
    result = {"like": 0, "clap": 0, "star": 0}
    for reaction_type, count in counts:
        if reaction_type in result:
            result[reaction_type] = count
    
    return result


@router.post("/{shoutout_id}/reactions", response_model=ReactionResponse, status_code=status.HTTP_200_OK)
async def toggle_reaction(
    shoutout_id: int,
    reaction_data: ReactionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Toggle a reaction on a shoutout.
    If the reaction exists, remove it. If it doesn't exist, add it.
    """
    try:
        # Check if shoutout exists
        shoutout = db.query(ShoutOut).filter(ShoutOut.id == shoutout_id).first()
        if not shoutout:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Shoutout not found"
            )
        
        # Check if reaction already exists
        existing_reaction = db.query(Reaction).filter(
            Reaction.shoutout_id == shoutout_id,
            Reaction.user_id == current_user.id,
            Reaction.type == reaction_data.type
        ).first()
        
        if existing_reaction:
            # Remove the reaction (toggle off)
            db.delete(existing_reaction)
            db.commit()
            message = "reaction_removed"
        else:
            # Add the reaction (toggle on)
            new_reaction = Reaction(
                type=reaction_data.type,
                user_id=current_user.id,
                shoutout_id=shoutout_id
            )
            db.add(new_reaction)
            db.commit()
            db.refresh(new_reaction)
            message = "reaction_added"
        
        # Get updated counts
        counts = get_reaction_counts(db, shoutout_id)
        
        return ReactionResponse(
            message=message,
            counts=ReactionCounts(**counts)
        )
    
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )


@router.get("/{shoutout_id}/reactions", response_model=ReactionCounts, status_code=status.HTTP_200_OK)
async def get_reactions(
    shoutout_id: int,
    db: Session = Depends(get_db)
):
    """Get reaction counts for a shoutout."""
    try:
        # Check if shoutout exists
        shoutout = db.query(ShoutOut).filter(ShoutOut.id == shoutout_id).first()
        if not shoutout:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Shoutout not found"
            )
        
        counts = get_reaction_counts(db, shoutout_id)
        return ReactionCounts(**counts)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )
