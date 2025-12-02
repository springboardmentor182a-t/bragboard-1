from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
from comments.models import Base as CommentBase
from comments.routes import router as comments_router
from src.shoutouts.controller import router as shoutouts_router
from analytics.routes import router as analytics_router

app = FastAPI()

# Create tables if not already present
CommentBase.metadata.create_all(bind=engine)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For demo; restrict for production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Attach routers to the main app
app.include_router(comments_router)
app.include_router(shoutouts_router)
app.include_router(analytics_router)
@app.get("/")
def root():
    return {"message": "API running"}
