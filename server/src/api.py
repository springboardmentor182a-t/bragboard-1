from fastapi import APIRouter
from .auth.controller import router as auth_router
from .users.controller import router as users_router
from .todos.controller import router as todos_router
from .leaderboard.controller import router as leaderboard_router

router = APIRouter()

router.include_router(auth_router)
router.include_router(users_router)
router.include_router(todos_router)
router.include_router(leaderboard_router)  # Add this line