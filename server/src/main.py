from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.core import Base, engine
from src.auth_controller import router as auth_router
from src.routes.reactions import router as reactions_router
from src.routes.comments import shoutout_comments_router, comments_router

# Import models to ensure they are registered with Base
from src.entities_user import User
from src.entities.shoutout import ShoutOut
from src.entities.comment import Comment
from src.entities.reaction import Reaction

# create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="BragBoard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(reactions_router)
app.include_router(shoutout_comments_router)
app.include_router(comments_router)

@app.get("/")
def root():
    return {"message": "BragBoard backend running!"}
