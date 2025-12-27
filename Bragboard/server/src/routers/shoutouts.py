from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List

from src.models.shoutout import Shoutout, shoutout_recipients_association
from src.models.user import User
from src.models.comment import Comment
from src.schemas.shoutout import ShoutoutCreate, ShoutoutResponse
from src.dependencies import get_db, get_current_user

router = APIRouter(prefix="/api/shoutouts", tags=["Shoutouts"])

@router.get("", response_model=List[ShoutoutResponse])
def get_shoutouts(db: Session = Depends(get_db)):
    shoutouts = (
        db.query(Shoutout)
        .options(
            joinedload(Shoutout.sender),
            joinedload(Shoutout.recipients),
            joinedload(Shoutout.reactions),
            joinedload(Shoutout.comments).joinedload(Comment.user)
        )
        .all()
    )
    return shoutouts

@router.post("", response_model=ShoutoutResponse)
def create_shoutout(
    data: ShoutoutCreate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    # Validate sender
    sender = db.query(User).filter(User.id == user["id"]).first()
    if not sender:
        raise HTTPException(status_code=404, detail="Sender not found")

    shoutout = Shoutout(
        sender_id=sender.id,
        message=data.message
    )
    
    # Handle Recipients
    if data.recipient_ids:
        recipients = db.query(User).filter(User.id.in_(data.recipient_ids)).all()
        shoutout.recipients = recipients
    
    db.add(shoutout)
    db.commit()
    db.refresh(shoutout)
    
    # Return with loaded relationships (empty mostly, but sender/recipients populated)
    # We might need to refresh relationships or rely on lazy loading for response
    # Eager loading on refresh isn't automatic, but for create response it's roughly fine
    return shoutout

@router.delete("/{shoutout_id}")
def delete_shoutout(
    shoutout_id: int, 
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
        
    shoutout = db.query(Shoutout).filter(Shoutout.id == shoutout_id).first()
    if not shoutout:
        raise HTTPException(status_code=404, detail="Shoutout not found")
        
    db.delete(shoutout)
    db.commit()
    return {"message": "Shoutout deleted"}
