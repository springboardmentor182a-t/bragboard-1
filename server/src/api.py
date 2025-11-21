from fastapi import APIRouter
from src.shoutouts.controller import router as shoutouts_router

api_router = APIRouter()

api_router.include_router(shoutouts_router)


