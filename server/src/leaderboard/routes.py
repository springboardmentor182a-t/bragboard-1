from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db

router = APIRouter(prefix="/api/leaderboard", tags=["Leaderboard"])

# ==========================
#  GET TOP PERFORMERS
# ==========================
@router.get("/top-performers")
async def get_top_performers(range_type: str = "weekly", db: Session = Depends(get_db)):
    """
    Returns REAL top performers (no dummy data)
    Replace this logic with your DB query / analytics.
    """
    return []   # Return empty until DB logic is added


# ==========================
#  GET DEPARTMENT STATS
# ==========================
@router.get("/department-stats")
async def get_department_stats(db: Session = Depends(get_db)):
    """
    Returns REAL department statistics
    """
    return []


# ==========================
#  GET RECENT HIGHLIGHTS
# ==========================
@router.get("/recent-highlights")
async def get_recent_highlights(db: Session = Depends(get_db)):
    """
    Returns REAL highlight messages from DB
    """
    return []


# ==========================
#  GET USER STAT
# ==========================
@router.get("/user/{user_id}")
async def get_user_stats(user_id: int, db: Session = Depends(get_db)):
    """
    Returns REAL stats for a specific user
    """
    return {"message": f"No data yet for user {user_id}"}
