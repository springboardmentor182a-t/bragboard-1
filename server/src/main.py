"""Entry point for the BragBoard Admin API."""
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ---------------------------
# Imports
# ---------------------------
from src.auth_controller import router as auth_router
from src.leaderboard_controller import router as leaderboard_router
from src.shoutout_controller import router as shoutout_router
from src.entities.entities_leaderboard import LeaderboardEntry
from .config import HOST, PORT

# ⚠️ CRITICAL: You need to import your team's routers here.
# If these lines were in the "Incoming Change" (Blue block) earlier,
# you need to find those files and import them. Examples:
# from src.reports_controller import router as reports_router
# from src.dashboard_controller import router as dashboard_router
# from src.analytics_controller import router as admin_analytics_router
# from src.admin_shoutout_controller import router as admin_shoutout_router

# ---------------------------
# Create FastAPI app
# ---------------------------
app = FastAPI(title="BragBoard API")

# ---------------------------
# CORS Middleware
# ---------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# Include routers (Combined List)
# ---------------------------
# 1. Common
app.include_router(auth_router)

# 2. Your Features
app.include_router(leaderboard_router)
app.include_router(shoutout_router)

# 3. Team's Features (Ensure imports exist above!)
# app.include_router(reports_router)
# app.include_router(admin_analytics_router)
# app.include_router(admin_shoutout_router)
# app.include_router(dashboard_router)


# ---------------------------
# Root endpoint
# ---------------------------
@app.get("/")
def root():
    return {"message": "BragBoard API is running"}

if __name__ == "__main__":
    uvicorn.run(app, host=HOST, port=PORT)