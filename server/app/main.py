from fastapi import FastAPI
from app.api.api_v1 import api_router

app = FastAPI(title="BragBoard API")

app.include_router(api_router)

@app.get("/")
def root():
    return {"message": "BragBoard FastAPI backend running"}
