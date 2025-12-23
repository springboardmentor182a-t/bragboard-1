"""
Create test shoutouts in the database
"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from database.core import SessionLocal, Base, engine
from shoutouts.models import Shoutout
from datetime import datetime

def create_test_shoutouts():
    # Create tables first
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Check if shoutouts already exist
    existing = db.query(Shoutout).count()
    if existing > 0:
        print(f"✅ Database already has {existing} shoutouts")
        return
    
    test_shoutouts = [
        {
            "emoji": "👏",
            "title": "Great Job!",
            "message": "Helped debug a critical issue before release",
            "sender_id": 1,
            "receiver_id": 2,
            "tag": "Teamwork",
            "created_at": datetime(2025, 12, 1),
        },
        {
            "emoji": "🎉",
            "title": "Amazing Presentation!",
            "message": "Delivered a great presentation for the client",
            "sender_id": 1,
            "receiver_id": 2,
            "tag": "Innovation",
            "created_at": datetime(2025, 12, 8),
        },
        {
            "emoji": "🚀",
            "title": "Launch Success!",
            "message": "Coordinated the launch of the new feature",
            "sender_id": 1,
            "receiver_id": 2,
            "tag": "Leadership",
            "created_at": datetime(2025, 12, 10),
        },
        {
            "emoji": "🤝",
            "title": "Team Player!",
            "message": "Supported multiple tickets during peak hours",
            "sender_id": 1,
            "receiver_id": 2,
            "tag": "Support",
            "created_at": datetime(2025, 12, 12),
        },
        {
            "emoji": "💡",
            "title": "Great Idea!",
            "message": "Suggested a brilliant UX improvement",
            "sender_id": 1,
            "receiver_id": 2,
            "tag": "Innovation",
            "created_at": datetime(2025, 12, 15),
        },
        {
            "emoji": "🌟",
            "title": "Star Performer!",
            "message": "Handled customer escalations with patience",
            "sender_id": 1,
            "receiver_id": 2,
            "tag": "CustomerFirst",
            "created_at": datetime(2025, 12, 16),
        },
    ]
    
    for data in test_shoutouts:
        shoutout = Shoutout(**data)
        db.add(shoutout)
    
    db.commit()
    print(f"✅ Created {len(test_shoutouts)} test shoutouts")
    
    # Print them
    all_shoutouts = db.query(Shoutout).all()
    for s in all_shoutouts:
        print(f"  - {s.emoji} {s.message} (ID: {s.id})")
    
    db.close()

if __name__ == "__main__":
    create_test_shoutouts()
