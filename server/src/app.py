"""FastAPI application factory."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import CORS_ORIGINS, API_TITLE, API_VERSION
from .auth import router as auth_router
from .users import router as users_router
from .todos import router as todos_router


def create_app() -> FastAPI:
    """
    Create and configure the FastAPI application.
    
    Returns:
        Configured FastAPI application instance
    """
    app = FastAPI(title=API_TITLE, version=API_VERSION)
    
    # CORS configuration
    app.add_middleware(
        CORSMiddleware,
        allow_origins=CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Register routers
    app.include_router(auth_router)
    app.include_router(users_router)
    app.include_router(todos_router)
    
    return app


# Create app instance
app = create_app()
