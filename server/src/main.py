# server/src/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.database import Base, engine
from src.routes.routes_auth import router as auth_router
from src.entities_user import User  # So that table is created

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="BragBoard API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Auth Routes
app.include_router(auth_router, prefix="/auth", tags=["auth"])

@app.get("/")
def root():
    return {"message": "BragBoard API running!"}
