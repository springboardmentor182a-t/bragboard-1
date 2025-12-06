from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
from comments.models import Base as CommentBase
from comments.routes import router as comments_router
from src.shoutouts.controller import router as shoutouts_router
from analytics.routes import router as analytics_router

from fastapi import APIRouter
from .auth.controller import router as auth_router
from .users.controller import router as users_router
from .todos.controller import router as todos_router
from .leaderboard.controller import router as leaderboard_router

router = APIRouter()

router.include_router(auth_router)
router.include_router(users_router)
router.include_router(todos_router)
router.include_router(leaderboard_router)  # Add this line
app = FastAPI()

# Create tables if not already present
CommentBase.metadata.create_all(bind=engine)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For demo; restrict for production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Attach routers to the main app
app.include_router(comments_router)
app.include_router(shoutouts_router)
app.include_router(analytics_router)
@app.get("/")
def root():
    return {"message": "API running"}
