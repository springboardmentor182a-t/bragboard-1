from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.database.core import Base, engine
from src.shoutouts.controller import router as shoutouts_router
from src.analytics.routes import router as analytics_router  # ⬅️ import your analytics router
from src.auth.auth_routes import router as auth_router  # ⬅️ import your auth router
from typing import List
from datetime import datetime, timedelta
import random
app = FastAPI()

# ⭐ CREATE TABLES
Base.metadata.create_all(bind=engine)
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# ⭐ ALLOW FRONTEND TO CONNECT
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,           
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ⭐ ROUTES
app.include_router(shoutouts_router)      # shoutouts APIs
app.include_router(analytics_router)      # analytics APIs
app.include_router(auth_router)  # auth APIs

# Demo Data
demo_users = [
    {"id": 1, "name": "Alex Johnson", "department": "Engineering", "avatar_color": "#3B82F6"},
    {"id": 2, "name": "Sarah Miller", "department": "Marketing", "avatar_color": "#10B981"},
    {"id": 3, "name": "David Chen", "department": "Engineering", "avatar_color": "#8B5CF6"},
    {"id": 4, "name": "Emma Wilson", "department": "Sales", "avatar_color": "#F59E0B"},
    {"id": 5, "name": "Michael Brown", "department": "HR", "avatar_color": "#EF4444"},
    {"id": 6, "name": "Priya Sharma", "department": "Engineering", "avatar_color": "#EC4899"},
    {"id": 7, "name": "James Taylor", "department": "Marketing", "avatar_color": "#6366F1"},
    {"id": 8, "name": "Lisa Wang", "department": "Finance", "avatar_color": "#14B8A6"},
    {"id": 9, "name": "Robert Garcia", "department": "Sales", "avatar_color": "#F97316"},
    {"id": 10, "name": "Maria Gonzalez", "department": "HR", "avatar_color": "#8B5CF6"},
]

def generate_demo_leaderboard():
    """Generate demo leaderboard data"""
    leaderboard = []
    
    for i, user in enumerate(demo_users):
        score = 250 - (i * 15) + random.randint(-10, 10)
        shoutouts_received = 15 - i + random.randint(-2, 2)
        shoutouts_sent = 12 - i + random.randint(-2, 2)
        total_reactions = (shoutouts_received * 3) + random.randint(0, 5)
        
        leaderboard.append({
            "user_id": user["id"],
            "name": user["name"],
            "department": user["department"],
            "score": max(score, 50),
            "rank": i + 1,
            "shoutouts_received": max(shoutouts_received, 1),
            "shoutouts_sent": max(shoutouts_sent, 1),
            "total_reactions": max(total_reactions, 5),
            "avatar_color": user["avatar_color"]
        })
    
    return sorted(leaderboard, key=lambda x: x["score"], reverse=True)

def generate_department_stats():
    """Generate demo department statistics"""
    departments = {}
    
    for user in demo_users:
        dept = user["department"]
        if dept not in departments:
            departments[dept] = {
                "total_shoutouts": 0,
                "users": [],
                "reactions": 0
            }
        departments[dept]["users"].append(user["name"])
    
    # Add random data
    for dept in departments:
        departments[dept]["total_shoutouts"] = random.randint(15, 45)
        departments[dept]["active_users"] = len(departments[dept]["users"])
        departments[dept]["avg_engagement"] = round(random.uniform(2.0, 3.5), 1)
        departments[dept]["most_active_user"] = random.choice(departments[dept]["users"])
    
    return [
        {
            "department": dept,
            "total_shoutouts": data["total_shoutouts"],
            "active_users": data["active_users"],
            "avg_engagement": data["avg_engagement"],
            "most_active_user": data["most_active_user"]
        }
        for dept, data in departments.items()
    ]

def generate_recent_highlights():
    """Generate demo recent highlights"""
    highlights = []
    messages = [
        "for helping me debug that tricky API issue",
        "for the amazing presentation to clients",
        "for going above and beyond on the project deadline",
        "for your creative marketing campaign idea",
        "for mentoring new team members",
        "for exceptional customer support",
        "for innovative solution to our workflow problem",
        "for being an awesome team player",
        "for handling the crisis situation calmly",
        "for your consistent high-quality work"
    ]
    
    for i in range(5):
        sender = random.choice(demo_users)
        recipient = random.choice([u for u in demo_users if u["id"] != sender["id"]])
        
        highlights.append({
            "id": i + 1,
            "from": sender["name"],
            "to": recipient["name"],
            "message": f"Great work {recipient['name'].split()[0]}! {random.choice(messages)}.",
            "time_ago": f"{random.randint(1, 24)} hours ago",
            "reactions": {
                "like": random.randint(5, 15),
                "clap": random.randint(3, 10),
                "star": random.randint(1, 5)
            }
        })
    
    return highlights

# API Endpoints
@app.get("/")
async def root():
    return {
        "message": "🎉 BragBoard Backend is running!",
        "endpoints": {
            "leaderboard": "/api/leaderboard/top-performers",
            "department_stats": "/api/leaderboard/department-stats",
            "recent_highlights": "/api/leaderboard/recent-highlights",
            "health": "/health"
        },
        "docs": "http://localhost:8000/docs"
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/api/leaderboard/top-performers")
async def get_top_performers(range_type: str = "weekly"):
    """Get top performing employees"""
    return generate_demo_leaderboard()

@app.get("/api/leaderboard/department-stats")
async def get_department_stats():
    """Get department statistics"""
    return generate_department_stats()

@app.get("/api/leaderboard/recent-highlights")
async def get_recent_highlights():
    """Get recent recognition highlights"""
    return generate_recent_highlights()

@app.get("/api/leaderboard/user/{user_id}")
async def get_user_stats(user_id: int):
    """Get stats for specific user"""
    leaderboard = generate_demo_leaderboard()
    user = next((u for u in leaderboard if u["user_id"] == user_id), None)
    
    if user:
        return {
            **user,
            "performance_trend": "up" if user["rank"] <= 3 else "stable",
            "weekly_change": random.randint(-5, 10)
        }
    return {"error": "User not found"}

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting BragBoard Backend...")
    print("📊 API Documentation: http://localhost:8000/docs")
    print("🔗 Frontend should connect to: http://localhost:3000")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
