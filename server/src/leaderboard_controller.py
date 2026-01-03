from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.core import get_db
from src.entities_user import User
from src.entities_shoutout import Shoutout
from src.entities.entities_leaderboard import LeaderboardEntry

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])


# ----------------------------------------------------
# LEVEL & XP CALCULATION
# ----------------------------------------------------
def calculate_level(points: int):
    if points >= 10:
        return "Diamond"
    elif points >= 6:
        return "Gold"
    elif points >= 3:
        return "Silver"
    return "Bronze"


def level_progress(points: int):
    if points < 3:
        return points / 3
    if points < 6:
        return (points - 3) / 3
    if points < 10:
        return (points - 6) / 4
    return 1.0


# ----------------------------------------------------
# LEADERBOARD API
# ----------------------------------------------------
@router.get("/")
def get_leaderboard(db: Session = Depends(get_db)):

    users = db.query(User).all()
    leaderboard = []

    for user in users:

        # 🔹 Ensure leaderboard row exists
        entry = (
            db.query(LeaderboardEntry)
            .filter(LeaderboardEntry.user_id == user.id)
            .first()
        )

        if not entry:
            entry = LeaderboardEntry(user_id=user.id)
            db.add(entry)
            db.commit()
            db.refresh(entry)

        # 🔹 Points = shoutouts received
        points = (
            db.query(Shoutout)
            .filter(Shoutout.receiver_id == user.id)
            .count()
        )

        # 🔹 Compute level + progress
        new_level = calculate_level(points)
        progress = level_progress(points)

        # 🔹 Update leaderboard values (SAFE)
        entry.points = points
        entry.level = new_level

        db.add(entry)
        db.commit()
        db.refresh(entry)

        leaderboard.append({
            "user_id": user.id,
            "name": user.name,
            "email": user.email,

            "points": entry.points,
            "level": entry.level,
            "progress": progress,

            "attempts": entry.attempts,
            "lastActive": (
                entry.last_active.isoformat()
                if entry.last_active else None
            )
        })

    # 🔹 Sort by points
    leaderboard.sort(key=lambda x: x["points"], reverse=True)

    # 🔹 Assign ranks
    for i, u in enumerate(leaderboard):
        u["rank"] = i + 1

    return leaderboard