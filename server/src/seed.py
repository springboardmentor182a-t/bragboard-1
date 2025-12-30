from database.core import SessionLocal
from shoutouts.models import Shoutout
from leaderboard.models import LeaderboardEntry
from auth.models import User
from constants.seed_data import EMPLOYEES, SHOUTOUTS, LEADERBOARD

db = SessionLocal()

def seed():
    # Employees - just use existing users, don't merge EMPLOYEES data
    # for emp in EMPLOYEES:
    #     db.merge(User(**emp))

    # Shoutouts
    for shout in SHOUTOUTS:
        db.merge(Shoutout(**shout))

    # Leaderboard
    for leader in LEADERBOARD:
        db.merge(LeaderboardEntry(**leader))

    db.commit()
    print("✅ Database seeded successfully")

if __name__ == "__main__":
    seed()
