from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.database.core import Base, engine
from src.shoutouts.controller import router as shoutouts_router
from src.analytics.routes import router as analytics_router  # ⬅️ import your analytics router
from src.auth.auth_routes import router as auth_router  # ⬅️ import your auth router

app = FastAPI()

# ⭐ CREATE TABLES
Base.metadata.create_all(bind=engine)
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# ⭐ ALLOW FRONTEND TO CONNECT
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,           
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ⭐ ROUTES
app.include_router(shoutouts_router)      # shoutouts APIs
app.include_router(analytics_router)      # analytics APIs
app.include_router(auth_router)  # auth APIs
