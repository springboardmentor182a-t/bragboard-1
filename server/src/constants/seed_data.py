from datetime import date

EMPLOYEES = [
    {"id": 1, "name": "Alice Johnson", "department": "Development"},
    {"id": 2, "name": "Bob Smith", "department": "Support"},
    {"id": 3, "name": "Priya Reddy", "department": "Marketing"},
    {"id": 4, "name": "Rahul Singh", "department": "Design"},
    {"id": 5, "name": "Maria Garcia", "department": "HR"},
    {"id": 6, "name": "Chen Wei", "department": "Development"},
    {"id": 7, "name": "Fatima Khan", "department": "Support"},
    {"id": 8, "name": "Liam O'Connor", "department": "Development"},
]

LEADERBOARD = [
    {"id": 1, "name": "Alice Johnson", "points": 120},
    {"id": 2, "name": "Bob Smith", "points": 110},
    {"id": 3, "name": "Priya Reddy", "points": 100},
    {"id": 4, "name": "Rahul Singh", "points": 90},
]

SHOUTOUTS = [
    {
        "id": 1,
        "emoji": "👏",
        "sender_id": 1,
        "receiver_id": 2,
        "message": "helped debug a critical issue before release",
        "tag": "Teamwork",
        "created_at": date(2025, 11, 1),
    },
    {
        "id": 2,
        "emoji": "🎉",
        "sender_id": 3,
        "receiver_id": 4,
        "message": "delivered a great presentation for the client",
        "tag": "Innovation",
        "created_at": date(2025, 11, 8),
    },
    {
        "id": 3,
        "emoji": "🚀",
        "sender_id": 1,
        "receiver_id": 3,
        "message": "coordinated the launch of the new feature",
        "tag": "Leadership",
        "created_at": date(2025, 11, 15),
    },
    {
        "id": 4,
        "emoji": "🤝",
        "sender_id": 2,
        "receiver_id": 1,
        "message": "supported multiple tickets during peak hours",
        "tag": "Support",
        "created_at": date(2025, 11, 18),
    },
    {
        "id": 5,
        "emoji": "💡",
        "sender_id": 4,
        "receiver_id": 3,
        "message": "suggested a UX improvement",
        "tag": "Innovation",
        "created_at": date(2025, 11, 22),
    },
    {
        "id": 6,
        "emoji": "🌟",
        "sender_id": 3,
        "receiver_id": 2,
        "message": "handled customer escalations patiently",
        "tag": "CustomerFirst",
        "created_at": date(2025, 11, 25),
    },
]
