from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.database import Base, engine

# Routers
from src.shoutouts.controller import router as shoutouts_router
from src.analytics.routes import router as analytics_router
from src.auth.auth_routes import router as auth_router
from src.leaderboard.routes import router as leaderboard_router  
from src.comments.routes import router as comments_router
from src.admin.routes import router as admin_router
from src.dashboard.routes import router as dashboard_router
app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
Base.metadata.create_all(bind=engine)

# Include Routers
app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(shoutouts_router)
app.include_router(comments_router)
app.include_router(analytics_router)
app.include_router(leaderboard_router)
app.include_router(dashboard_router, tags=["Dashboard"])

@app.get("/")
async def root():
    return {
        "message": "🎉 BragBoard Backend is running!",
        "docs": "http://localhost:8000/docs"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}
