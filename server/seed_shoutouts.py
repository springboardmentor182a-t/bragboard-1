import sys
import os

# Add the server directory to the path
server_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, server_dir)

from src.database.core import SessionLocal
from src.entities import Shoutout
from datetime import datetime

db = SessionLocal()

# Delete existing shoutouts first
db.query(Shoutout).delete()
db.commit()

# Create shoutouts with correct sender/receiver IDs
shoutouts_data = [
    {
        "id": 1,
        "emoji": "👏",
        "sender_id": 1,
        "receiver_id": 2,
        "message": "helped debug a critical issue before release",
        "tag": "Teamwork",
        "created_at": datetime(2025, 11, 1),
    },
    {
        "id": 2,
        "emoji": "🎉",
        "sender_id": 3,
        "receiver_id": 4,
        "message": "delivered a great presentation for the client",
        "tag": "Innovation",
        "created_at": datetime(2025, 11, 8),
    },
    {
        "id": 3,
        "emoji": "🚀",
        "sender_id": 1,
        "receiver_id": 3,
        "message": "coordinated the launch of the new feature",
        "tag": "Leadership",
        "created_at": datetime(2025, 11, 15),
    },
    {
        "id": 4,
        "emoji": "🤝",
        "sender_id": 2,
        "receiver_id": 1,
        "message": "supported multiple tickets during peak hours",
        "tag": "Support",
        "created_at": datetime(2025, 11, 18),
    },
    {
        "id": 5,
        "emoji": "💡",
        "sender_id": 4,
        "receiver_id": 3,
        "message": "suggested a UX improvement that reduced confusion",
        "tag": "Innovation",
        "created_at": datetime(2025, 11, 22),
    },
    {
        "id": 6,
        "emoji": "🌟",
        "sender_id": 3,
        "receiver_id": 2,
        "message": "handled customer escalations patiently",
        "tag": "CustomerFirst",
        "created_at": datetime(2025, 11, 25),
    },
]

for shout_data in shoutouts_data:
    shoutout = Shoutout(**shout_data)
    db.add(shoutout)
    print(f"Created shoutout ID {shout_data['id']}: {shout_data['message'][:30]}...")

db.commit()
print("\n✅ Shoutouts seeded successfully!")
db.close()
