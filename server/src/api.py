from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from comments.routes import router as comments_router
from shoutouts.controller import router as shoutouts_router, admin_router as admin_shoutouts_router
from database import Base, engine
from shoutouts.models import Shoutout 
from entities.comments import Comment
from reactions_module.models import Reaction
from analytics.routes import router as analytics_router
from auth.auth_routes import router as auth_router
from reports.controllers import router as reports_router
from admin.routes import router as admin_router
from leaderboard.models import LeaderboardEntry

# Leaderboard endpoints
try:
    from src.leaderboard.routes import router as leaderboard_router
except ImportError:  # pragma: no cover - standard local import path
    from leaderboard.routes import router as leaderboard_router

app = FastAPI()

# Create tables if not already present
Base.metadata.create_all(bind=engine)

import logging

logger = logging.getLogger("uvicorn.error")


@app.on_event("startup")
def log_registered_routes():
    logger.info("Listing registered routes:")
    try:
        for r in app.routes:
            path = getattr(r, "path", None) or getattr(r, "pattern", None) or str(r)
            methods = getattr(r, "methods", None)
            logger.info(f"{path}  methods={methods}")
    except Exception:
        logger.exception("Failed to list routes")

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # For demo; restrict for production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Attach routers to the main app
app.include_router(comments_router)
app.include_router(shoutouts_router)
app.include_router(analytics_router)
app.include_router(admin_shoutouts_router)
app.include_router(auth_router)
app.include_router(reports_router)
app.include_router(admin_router)
app.include_router(leaderboard_router)

@app.get("/")
def root():
    return {"message": "API running"}
