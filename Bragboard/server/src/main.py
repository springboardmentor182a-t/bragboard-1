from fastapi import FastAPI
from src.database import engine, Base, SessionLocal
from src.analytics.analytics_controller import router as analytics_router
from src.employee.employee_controller import router as employee_router
from src.routers.report_routers import router as report_router
from src.auth.routes import router as auth_router
from src.routers.export_routers import router as export_router

# Create tables
Base.metadata.create_all(bind=engine)
app = FastAPI(
    title="Reporting Shoutouts API",
    version="1.0.0",
    description="APIs for employees to report shoutouts and for admins to manage reports."
)

# Include routers
app.include_router(analytics_router, prefix="/admin",
                   tags=["Admin Dashboard Analytics"])
app.include_router(employee_router, prefix="/employee",
                   tags=["Employee Analytics"])
app.include_router(report_router)
app.include_router(export_router) 
app.include_router(auth_router, prefix="/auth")


@app.get("/", tags=["Health"])
def root():
    return {"message": "API Server Running ✅"}
