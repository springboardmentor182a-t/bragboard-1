\from fastapi import FastAPI
from src.database import engine, Base, SessionLocal
from src.analytics.analytics_controller import router as analytics_router
from src.employee.employee_controller import router as employee_router

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="BragBoard Backend APIs")

# Include routers
app.include_router(analytics_router, prefix="/admin", tags=["Admin Dashboard Analytics"])
app.include_router(employee_router, prefix="/employee", tags=["Employee Analytics"])

@app.get("/")
def root():
    return {"message": "API Server Running ✅"}
