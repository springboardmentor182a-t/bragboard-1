from fastapi import FastAPI
from auth_routes import router
from database import Base, engine
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(title="BragBoard Auth")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




Base.metadata.create_all(bind=engine)

app.include_router(router, prefix="/auth", tags=["Auth"])