# server/src/config.py

from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Secret key for JWT or other security purposes
    SECRET_KEY: str
    
    # JWT algorithm
    ALGORITHM: str = "HS256"
    
    # Access token expiry in minutes
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    # Refresh token expiry in days
    REFRESH_TOKEN_EXPIRE_DAYS: int
    
    # Database connection URL
    DATABASE_URL: str

    # SMTP settings for email (forgot password)
    SMTP_SERVER: str = "localhost"  # Use localhost for debug SMTP
    SMTP_PORT: int = 1025           # Debug SMTP port
    SMTP_EMAIL: str = "test@example.com"  # From address
    SMTP_PASSWORD: str = ""         # Not needed for debug

    # Pydantic v2 configuration
    model_config = {
        "env_file": ".env",             # Load environment variables from .env
        "env_file_encoding": "utf-8",   # Ensure proper encoding
        "extra": "allow",               # Allow extra env variables without errors
        "from_attributes": True         # Replaces orm_mode
    }

# Instantiate settings
settings = Settings()
