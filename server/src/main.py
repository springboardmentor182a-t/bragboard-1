"""Entry point for the BragBoard Admin API."""
import uvicorn
from .app import app
from .config import HOST, PORT

if __name__ == "__main__":
    uvicorn.run(app, host=HOST, port=PORT)

# ---------------------------
# Import routers
# ---------------------------
from src.auth_controller import router as auth_router
from src.leaderboard_controller import router as leaderboard_router
from src.shoutout_controller import router as shoutout_router   # ⭐ NEW IMPORT
from src.entities.entities_leaderboard import LeaderboardEntry


# ---------------------------
# Create FastAPI app
# ---------------------------
app = FastAPI(title="BragBoard API")

# ---------------------------
# CORS Middleware
# ---------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

<<<<<<< HEAD
# Routers
app.include_router(auth_router)
app.include_router(leaderboard_router)
app.include_router(shoutout_router)   # ⭐ NEW ROUTER
=======
# ---------------------------
# Include routers
# ---------------------------
app.include_router(auth_router)
app.include_router(reports_router)
app.include_router(admin_analytics_router)
app.include_router(admin_shoutout_router)  
app.include_router(dashboard_router)
>>>>>>> 2cc6a31e3e11bce788783f6a8b7e4e5eb48d7ac5


# ---------------------------
# Root endpoint
# ---------------------------
@app.get("/")
def root():
    return {"message": "BragBoard API is running"}
