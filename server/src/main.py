from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.database import Base, engine

# Routers
from src.shoutouts.controller import router as shoutouts_router
from src.auth.auth_routes import router as auth_router
from src.leaderboard.routes import router as leaderboard_router
from src.comments.routes import router as comments_router
from src.dashboards.routes import router as dashboard_router

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
Base.metadata.create_all(bind=engine)

# Include Routers
app.include_router(auth_router, tags=["Auth"])
app.include_router(shoutouts_router, tags=["Shoutouts"])
app.include_router(comments_router, tags=["Comments"])
app.include_router(leaderboard_router, tags=["Leaderboard"])
app.include_router(dashboard_router, tags=["Dashboard"])


@app.get("/")
async def root():
    return {
        "message": "🎉 BragBoard Backend is running!",
        "docs": "http://127.0.0.1:8000/docs"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}

