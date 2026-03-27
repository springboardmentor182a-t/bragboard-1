from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.database.core import Base, engine
from src.shoutouts.controller import router as shoutouts_router

app = FastAPI()

# ⭐ CREATE TABLES
Base.metadata.create_all(bind=engine)

# ⭐ ALLOW FRONTEND TO CONNECT
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],           # allow all for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ⭐ ROUTES
app.include_router(shoutouts_router)
