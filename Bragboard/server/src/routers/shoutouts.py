from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.models.shoutout import Shoutout
from src.schemas.shoutout import ShoutoutCreate
from src.dependencies import get_db, get_current_user

router = APIRouter(prefix="/api/shoutouts", tags=["Shoutouts"])

@router.get("")
def get_shoutouts(db: Session = Depends(get_db)):
    shoutouts = db.query(Shoutout).all()
    return [
        {
            "id": s.id,
            "message": s.message,
            "created_at": s.created_at
        }
        for s in shoutouts
    ]

@router.post("")
def create_shoutout(
    data: ShoutoutCreate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    shoutout = Shoutout(
        sender_id=user["id"],
        message=data.message
    )
    db.add(shoutout)
    db.commit()
    db.refresh(shoutout)

    return {
        "id": shoutout.id,
        "message": shoutout.message
    }
