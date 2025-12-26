from sqlalchemy.orm import Session
from models.user import User
from models.leaderboard import Leaderboard

def get_leaderboard(db: Session):
    results = (
        db.query(
            User.id,
            User.name,
            User.department,
            Leaderboard.points
        )
        .join(Leaderboard, User.id == Leaderboard.user_id)
        .order_by(Leaderboard.points.desc())
        .all()
    )

    leaderboard = []
    rank = 1
    for r in results:
        leaderboard.append({
            "rank": rank,
            "user_id": r.id,
            "name": r.name,
            "department": r.department,
            "points": r.points
        })
        rank += 1

    return leaderboard
