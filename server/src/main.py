# server/src/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ---------------------------
# Import routers
# ---------------------------
from src.auth_controller import router as auth_router
from src.reports_controller import router as reports_router
from src.admin_analytics_controller import router as admin_analytics_router  # <-- Added

# ---------------------------
# Create FastAPI app
# ---------------------------
app = FastAPI(title="BragBoard API")

# ---------------------------
# CORS Middleware
# ---------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# Include routers
# ---------------------------
app.include_router(auth_router)
app.include_router(reports_router)
app.include_router(admin_analytics_router)  # <-- Added

# ---------------------------
# Root endpoint
# ---------------------------
@app.get("/")
def root():
    return {"message": "BragBoard API is running"}
