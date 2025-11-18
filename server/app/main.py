from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import router

app = FastAPI(title="BragBoard API")

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include your API routes
app.include_router(router, prefix="/api")

@app.get("/")
def root():
    return {"message": "BragBoard API is running"}
