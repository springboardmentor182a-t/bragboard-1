from fastapi import FastAPI
from src.database import Base, engine

# Routers
from src.shoutouts.controller import router as shoutouts_router
from src.analytics.routes import router as analytics_router
from src.auth.auth_routes import router as auth_router
from src.leaderboard.routes import router as leaderboard_router  

app = FastAPI()

# Create tables
Base.metadata.create_all(bind=engine)

# Include Routers
app.include_router(shoutouts_router)
app.include_router(analytics_router)
app.include_router(auth_router)
app.include_router(leaderboard_router)     

@app.get("/")
async def root():
    return {
        "message": "🎉 BragBoard Backend is running!",
        "docs": "http://localhost:8000/docs"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}
