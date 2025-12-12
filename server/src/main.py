from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.database.core import Base, engine
from src.shoutouts.controller import router as shoutouts_router
from src.analytics.routes import router as analytics_router
from src.auth.auth_routes import router as auth_router
from src.reports.controllers import router as reports_router

app = FastAPI()

# ⭐ CREATE DATABASE TABLES
Base.metadata.create_all(bind=engine)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# ⭐ CORS SETTINGS — ALLOW FRONTEND ACCESS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ⭐ REGISTER ROUTERS
app.include_router(shoutouts_router)   # Shoutouts APIs
app.include_router(analytics_router)   # Analytics APIs
app.include_router(auth_router)        # Authentication APIs
app.include_router(reports_router)     # Reports APIs
