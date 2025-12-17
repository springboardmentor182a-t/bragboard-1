from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import uvicorn

app = FastAPI(title="BragBoard Admin API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Models
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str

class User(BaseModel):
    id: int
    name: str
    email: str
    status: str

class ShoutOut(BaseModel):
    id: int
    author: str
    content: str
    status: str

class FlaggedItem(BaseModel):
    id: int
    content: str
    reporter: str
    reason: str
    severity: str

# Mock database (replace with actual database)
mock_users = [
    {"id": 1, "name": "John Doe", "email": "john@example.com", "status": "Active"},
    {"id": 2, "name": "Jane Smith", "email": "jane@example.com", "status": "Active"},
]

mock_shoutouts = [
    {"id": 1, "author": "John Doe", "content": "Great job!", "status": "Pending"},
    {"id": 2, "author": "Jane Smith", "content": "Amazing work!", "status": "Approved"},
]

# Authentication Routes
@app.post("/api/auth/login")
async def login(credentials: UserLogin):
    """Admin login endpoint"""
    # TODO: Implement proper authentication with password hashing
    if credentials.email and credentials.password:
        return {
            "token": "mock-jwt-token",
            "user": {"email": credentials.email, "role": "admin"}
        }
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/api/auth/signup")
async def signup(user_data: UserSignup):
    """Admin signup endpoint"""
    # TODO: Implement user creation with password hashing
    return {
        "message": "Account created successfully",
        "user": {"name": user_data.name, "email": user_data.email}
    }

# User Management Routes
@app.get("/api/users", response_model=List[User])
async def get_users():
    """Get all users"""
    return mock_users

@app.get("/api/users/{user_id}")
async def get_user(user_id: int):
    """Get user by ID"""
    user = next((u for u in mock_users if u["id"] == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/api/users")
async def create_user(user: User):
    """Create new user"""
    mock_users.append(user.dict())
    return {"message": "User created successfully", "user": user}

@app.put("/api/users/{user_id}")
async def update_user(user_id: int, user: User):
    """Update user"""
    return {"message": "User updated successfully", "user": user}

@app.delete("/api/users/{user_id}")
async def delete_user(user_id: int):
    """Delete user"""
    return {"message": "User deleted successfully"}

# Shout-out Moderation Routes
@app.get("/api/shoutouts", response_model=List[ShoutOut])
async def get_shoutouts(status: Optional[str] = None):
    """Get all shout-outs, optionally filtered by status"""
    if status:
        return [s for s in mock_shoutouts if s["status"] == status]
    return mock_shoutouts

@app.put("/api/shoutouts/{shoutout_id}/approve")
async def approve_shoutout(shoutout_id: int):
    """Approve a shout-out"""
    return {"message": "Shout-out approved", "id": shoutout_id}

@app.put("/api/shoutouts/{shoutout_id}/reject")
async def reject_shoutout(shoutout_id: int):
    """Reject a shout-out"""
    return {"message": "Shout-out rejected", "id": shoutout_id}

# Flagged Content Routes
@app.get("/api/flagged")
async def get_flagged_content():
    """Get all flagged content"""
    return [
        {"id": 1, "content": "Suspicious activity", "reporter": "John", "reason": "Spam", "severity": "High"},
        {"id": 2, "content": "Inappropriate language", "reporter": "Jane", "reason": "Inappropriate", "severity": "Medium"},
    ]

@app.put("/api/flagged/{item_id}/resolve")
async def resolve_flagged_content(item_id: int, action: str):
    """Resolve flagged content"""
    return {"message": f"Flagged content {action}", "id": item_id}

# Analytics Routes
@app.get("/api/analytics/overview")
async def get_analytics_overview():
    """Get analytics overview"""
    return {
        "total_users": 2543,
        "total_shoutouts": 8234,
        "flagged_content": 23,
        "engagement_rate": 94.2
    }

@app.get("/api/analytics/user-growth")
async def get_user_growth():
    """Get user growth data"""
    return {
        "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        "data": [100, 250, 400, 800, 1500, 2543]
    }

@app.get("/api/analytics/engagement")
async def get_engagement_metrics():
    """Get engagement metrics"""
    return {
        "daily_active_users": 1234,
        "average_session_time": "8m 42s",
        "posts_per_day": 156
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
