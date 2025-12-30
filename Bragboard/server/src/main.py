from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.database import engine, Base
from src.analytics.analytics_controller import router as analytics_router
from src.employee.employee_controller import router as employee_router
from src.routers.report_routers import router as report_router
from src.auth.routes import router as auth_router
from src.routers.export_routers import router as export_router
from src.shoutouts.controller import router as shoutout_router
from src.routers.leaderboard_router import router as leaderboard_router
from src.users.controller import router as users_router
from src.settings.controller import router as settings_router

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="BragBoard API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "BragBoard FastAPI Server Running"}

# Include routers
app.include_router(auth_router)
app.include_router(analytics_router) # already has prefix /analytics
app.include_router(employee_router) # already has prefix /employee
app.include_router(report_router) # already has prefix /reports
app.include_router(export_router) # already has prefix /export
app.include_router(shoutout_router) # already has prefix /shoutouts
app.include_router(leaderboard_router) # already has prefix /leaderboard
app.include_router(users_router) # already has prefix /users
app.include_router(settings_router) # already has prefix /settings
