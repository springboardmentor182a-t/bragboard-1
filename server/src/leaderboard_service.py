from sqlalchemy.orm import Session
from src.entities.entities_leaderboard import LeaderboardEntry
from src.schemas.schemas_leaderboard import LeaderboardCreate
from datetime import datetime

def get_all_players(db: Session):
    players = db.query(LeaderboardEntry).order_by(LeaderboardEntry.points.desc()).all()
    # add rank
    result = []
    for idx, p in enumerate(players):
        out = {
            "id": p.id,
            "name": p.name,
            "email": p.email,
            "points": p.points,
            "attempts": p.attempts,
            "level": p.level,
            "last_active": p.last_active,
            "rank": idx + 1
        }
        result.append(out)
    return result

def get_player(db: Session, player_id: int):
    return db.query(LeaderboardEntry).filter(LeaderboardEntry.id == player_id).first()

def create_player(db: Session, payload: LeaderboardCreate):
    new = LeaderboardEntry(
        name=payload.name,
        email=payload.email,
        points=payload.points,
        attempts=payload.attempts,
        level=payload.level,
        last_active=datetime.utcnow()
    )
    db.add(new)
    db.commit()
    db.refresh(new)
    return new

def update_player(db: Session, player_id: int, payload: LeaderboardCreate):
    p = db.query(LeaderboardEntry).filter(LeaderboardEntry.id == player_id).first()
    if not p:
        return None
    p.name = payload.name
    p.email = payload.email
    p.points = payload.points
    p.attempts = payload.attempts
    p.level = payload.level
    p.last_active = datetime.utcnow()
    db.commit()
    db.refresh(p)
    return p

def delete_player(db: Session, player_id: int):
    p = db.query(LeaderboardEntry).filter(LeaderboardEntry.id == player_id).first()
    if not p:
        return False
    db.delete(p)
    db.commit()
    return True
