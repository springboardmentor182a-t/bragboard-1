# server/src/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.database import Base, engine

# Import models so SQLAlchemy creates tables
from src.entities_user import User
from src.entities.shoutout import ShoutOut
from src.entities.comment import Comment
from src.entities.reaction import Reaction
from src.entities.report import Report   # <-- NEW REPORT MODEL

# Import routers
from src.routes.routes_auth import router as auth_router
from src.routes.routes_reports import router as employee_report_router
from src.routes.routes_reports_admin import router as admin_report_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="BragBoard API")

# --- CORS MIDDLEWARE ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # change in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ROUTES ---
app.include_router(auth_router, prefix="/auth", tags=["Auth"])

# Employee report routes → /reports/*
app.include_router(employee_report_router)

# Admin report routes → /admin/reports/*
app.include_router(admin_report_router)


@app.get("/")
def root():
    return {"message": "BragBoard API is running!"}
