from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.core import Base, engine
from src.auth_controller import router as auth_router
from src.leaderboard_controller import router as leaderboard_router
from src.shoutout_controller import router as shoutout_router   # ⭐ NEW IMPORT

# create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="BragBoard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router)
app.include_router(leaderboard_router)
app.include_router(shoutout_router)   # ⭐ NEW ROUTER

@app.get("/")
def root():
    return {"message": "BragBoard backend running!"}
