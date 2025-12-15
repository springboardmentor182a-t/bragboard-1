from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime

from src.core import get_db
from src.entities_user import User
from src.entities_shoutout import Shoutout

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])


# ----------------------------------------------------
# LEVEL & XP CALCULATION
# ----------------------------------------------------
def calculate_level(points: int):
    """Return level string based on earned points."""
    if points >= 10:
        return "Diamond"
    elif points >= 6:
        return "Gold"
    elif points >= 3:
        return "Silver"
    return "Bronze"


def level_progress(points: int):
    """Return XP progress ratio (0 to 1) for progress bar."""

    # Bronze → Silver (needs 3 points)
    if points < 3:
        return points / 3

    # Silver → Gold (needs 3 points)
    if points < 6:
        return (points - 3) / 3

    # Gold → Diamond (needs 4 points)
    if points < 10:
        return (points - 6) / 4

    # Diamond max
    return 1.0


# ----------------------------------------------------
# LEADERBOARD API
# ----------------------------------------------------
@router.get("/")
def get_leaderboard(db: Session = Depends(get_db)):

    users = db.query(User).all()
    leaderboard = []

    for user in users:

        # Count shoutouts received → points
        points = db.query(Shoutout).filter(
            Shoutout.receiver_id == user.id
        ).count()

        # Compute level + progress
        new_level = calculate_level(points)
        progress = level_progress(points)

        # Update level ONLY if changed
        if user.level != new_level:
            user.level = new_level
            db.add(user)
            db.commit()
            db.refresh(user)

        # Return lastActive in ISO format
        if user.last_active:
            try:
                last_active = user.last_active.isoformat()
            except:
                last_active = str(user.last_active)
        else:
            last_active = None

        leaderboard.append({
            "user_id": user.id,
            "name": user.name,
            "email": user.email,

            "points": points,
            "level": new_level,
            "progress": progress,     # ⭐ XP BAR VALUE

            "attempts": user.attempts,
            "lastActive": last_active,
        })

    # Sort leaderboard by points (descending)
    leaderboard.sort(key=lambda x: x["points"], reverse=True)

    # Assign rank
    for i, u in enumerate(leaderboard):
        u["rank"] = i + 1

    return leaderboard
