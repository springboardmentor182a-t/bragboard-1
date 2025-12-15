from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from src.core import get_db
from src.entities_shoutout import Shoutout
from src.entities_user import User

router = APIRouter(prefix="/shoutouts", tags=["Shoutouts"])


@router.post("/")
def create_shoutout(
    message: str,
    sender_id: int,
    receiver_id: int,
    db: Session = Depends(get_db)
):
    sender = db.query(User).filter(User.id == sender_id).first()
    receiver = db.query(User).filter(User.id == receiver_id).first()

    if not sender or not receiver:
        raise HTTPException(status_code=404, detail="Sender or receiver not found")

    # ✅ Create shoutout
    shout = Shoutout(
        message=message,
        sender_id=sender_id,
        receiver_id=receiver_id
    )
    db.add(shout)

    # ✅ Update activity timestamps
    now = datetime.utcnow()
    sender.last_active = now
    receiver.last_active = now

    # ✅ INCREMENT ATTEMPTS (THIS WAS MISSING)
    sender.attempts += 1

    db.commit()
    db.refresh(shout)

    return {
        "message": "Shoutout created!",
        "shoutout": shout
    }


@router.get("/")
def get_shoutouts(db: Session = Depends(get_db)):
    return db.query(Shoutout).all()
