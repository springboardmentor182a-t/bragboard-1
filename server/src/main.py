from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.core import Base, engine
from src.auth_controller import router as auth_router

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

@app.get("/")
def root():
    return {"message": "BragBoard backend running!"}
