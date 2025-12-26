from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from services.leaderboard_service import get_leaderboard

router = APIRouter(prefix="/leaderboard", tags=["Leaderboard"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def leaderboard(db: Session = Depends(get_db)):
    return get_leaderboard(db)
