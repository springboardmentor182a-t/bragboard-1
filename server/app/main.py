# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db import engine, Base
from app.routes import auth  # requires app/routes/__init__.py and app/routes/auth.py to exist

app = FastAPI(title="BragBoard Auth (dev)")

# CORS: allow your React dev server. Adjust origins as needed.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # add other origins if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    # create DB tables if not present (convenient in dev)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# include auth router
app.include_router(auth.router)

@app.get("/health")
async def health():
    return {"status": "ok"}
