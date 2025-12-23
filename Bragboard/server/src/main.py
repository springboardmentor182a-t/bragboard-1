from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .modules.comments.comment_model import Comment
from .modules.comments.comment_controller import router as comment_router

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

# Register Routers
app.include_router(comment_router)

@app.get("/")
def root():
    return {"message": "BragBoard FastAPI Server Running"}
