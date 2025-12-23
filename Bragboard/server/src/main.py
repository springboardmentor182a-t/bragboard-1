from fastapi import FastAPI
from src.database import engine, Base, SessionLocal
from src.analytics.analytics_controller import router as analytics_router
from src.employee.employee_controller import router as employee_router
from src.routers.report_routers import router as report_router
from src.auth.routes import router as auth_router
from src.routers.export_routers import router as export_router
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
