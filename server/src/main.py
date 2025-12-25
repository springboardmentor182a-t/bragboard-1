<<<<<<< HEAD
import sys
import os

# Ensure the current directory is in the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
=======
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.database import Base, engine
>>>>>>> 3e2424c214281832d92a15cbeb86496329d2c772

# Routers
from shoutouts.controller import router as shoutouts_router
from analytics.routes import router as analytics_router
from auth.auth_routes import router as auth_router
from leaderboard.routes import router as leaderboard_router  
from comments.routes import router as comments_router
from admin.routes import router as admin_router

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
Base.metadata.create_all(bind=engine)

# Include Routers
app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(shoutouts_router)
app.include_router(comments_router)
app.include_router(analytics_router)
app.include_router(leaderboard_router)

@app.get("/")
async def root():
    return {
        "message": "🎉 BragBoard Backend is running!",
        "docs": "http://localhost:8000/docs"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}
