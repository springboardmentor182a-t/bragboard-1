from fastapi import FastAPI
from src.database import engine, Base, SessionLocal
from src.analytics.analytics_controller import router as analytics_router
from src.employee.employee_controller import router as employee_router
from src.routers.report_routers import router as report_router
from src.auth.routes import router as auth_router
from src.routers.export_routers import router as export_router
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .modules.comments.comment_model import Comment
from .modules.comments.comment_controller import router as comment_router
from src.database import Base, engine
from src.models import user  # Import to register User model
from src.routers import shoutouts, reactions
from src.shoutouts.controller import router as shoutout_router
from fastapi.middleware.cors import CORSMiddleware
from models.user import Base
from models import leaderboard, shoutout, reaction  # Import all models to register them
from database import engine
from routers.leaderboard_router import router as leaderboard_router

Base.metadata.create_all(bind=engine)

app = FastAPI()
# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app = FastAPI(title="BragBoard API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(leaderboard_router)
