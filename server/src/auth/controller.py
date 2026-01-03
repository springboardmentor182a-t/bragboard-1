"""Authentication controller (routes)."""
from fastapi import APIRouter
from .models import UserLogin, UserSignup, AuthResponse
from .service import authenticate_user, register_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/login", response_model=AuthResponse)
async def login(credentials: UserLogin):
    """Admin login endpoint."""
    return await authenticate_user(credentials)


@router.post("/signup")
async def signup(user_data: UserSignup):
    """Admin signup endpoint."""
    return await register_user(user_data)
