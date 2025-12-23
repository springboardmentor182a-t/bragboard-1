from fastapi import FastAPI
from src.database import engine, Base, SessionLocal
from src.analytics.analytics_controller import router as analytics_router
from src.employee.employee_controller import router as employee_router
from src.routers.report_routers import router as report_router
from src.auth.routes import router as auth_router
from src.routers.export_routers import router as export_router
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .modules.comments.comment_model import Comment
from .modules.comments.comment_controller import router as comment_router
from src.database import Base, engine
from src.models import user  # Import to register User model
from src.routers import shoutouts, reactions
from src.shoutouts.controller import router as shoutout_router

# Create all tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(title="BragBoard API", version="1.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
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
# Include routers
app.include_router(analytics_router, prefix="/admin",
                   tags=["Admin Dashboard Analytics"])
app.include_router(employee_router, prefix="/employee",
                   tags=["Employee Analytics"])
app.include_router(report_router)
app.include_router(export_router) 
app.include_router(shoutout_router, tags=["Shout-Outs"])
app.include_router(auth_router, prefix="/auth")

# Register Routers
app.include_router(comment_router)

@app.get("/")
def root():
    return {"message": "BragBoard FastAPI Server Running"}
    return {"message": "BragBoard API is running"}

app.include_router(shoutouts.router)
app.include_router(reactions.router)
