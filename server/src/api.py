import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# --- Router Imports ---
# NOTE: All database imports (init_db, Base) are REMOVED/COMMENTED OUT
from src.users.controller import router as users_router
from src.reports.controller import router as reports_router 

# Load environment variables from .env file
load_dotenv() 

# -------------------------------------------------------------
# 1. Initialize the FastAPI Application
# -------------------------------------------------------------
app = FastAPI(
    title="BragBoard Admin API",
    version="1.0.0"
)

# -------------------------------------------------------------
# 2. Configure Lifespan Functions 
# -------------------------------------------------------------

@app.on_event("startup")
async def startup_event():
    """
    Runs when the application starts. 
    Database initialization is DISABLED for submission.
    """
    print("Database connection disabled for submission. Using mock data.")

# -------------------------------------------------------------
# 3. Configure CORS
# -------------------------------------------------------------
origins = [
    "http://localhost:3000",  # Your React Frontend
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------------
# 4. Root Endpoint (Health Check)
# -------------------------------------------------------------
@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to BragBoard Admin API. Check /docs for endpoints."}

# -------------------------------------------------------------
# 5. Include/Register Routers
# -------------------------------------------------------------
app.include_router(users_router) 
app.include_router(reports_router)