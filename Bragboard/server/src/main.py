from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models.user import Base
from models import leaderboard, shoutout, reaction  # Import all models to register them
from database import engine
from routers.leaderboard_router import router as leaderboard_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(leaderboard_router)
