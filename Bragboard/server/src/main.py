from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.database import Base, engine
from src.models import user  # Import to register User model
from src.routers import shoutouts, reactions
Base.metadata.create_all(bind=engine)
app = FastAPI(title="BragBoard API")
# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "BragBoard API is running"}

app.include_router(shoutouts.router)
app.include_router(reactions.router)
