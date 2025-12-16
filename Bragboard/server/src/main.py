from fastapi import FastAPI
from src.database import engine, Base, SessionLocal
from src.analytics.analytics_controller import router as analytics_router
from src.employee.employee_controller import router as employee_router
from routers.report_routers import router as report_router
from src.auth import router as auth_routefrom fastapi import FastAPI
from server.src.database import Base, engine
from server.src.modules.comments.comment_model import Comment
from server.src.modules.comments.comment_controller import router as comment_router

# Create all tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(title="BragBoard API", version="1.0")

# Register Routers
app.include_router(comment_router)

@app.get("/")
def root():
    return {"message": "BragBoard FastAPI Server Running"}
