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
from src.reports_controller import router as reports_router
from src.admin.admin_analytics_controller import router as admin_analytics_router
from src.admin.admin_shoutout_controller import router as admin_shoutout_router  
from src.dashboard_controller import router as dashboard_router


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

# ---------------------------
# Include routers
# ---------------------------
app.include_router(auth_router)
app.include_router(reports_router)
app.include_router(admin_analytics_router)
app.include_router(admin_shoutout_router)  
app.include_router(dashboard_router)


# ---------------------------
# Root endpoint
# ---------------------------
@app.get("/")
def root():
    return {"message": "BragBoard API is running"}
