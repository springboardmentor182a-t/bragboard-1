# app/services/token_service.py
import jwt
from datetime import datetime, timedelta, timezone
import secrets
from typing import Tuple
from app.config import settings
from app.utils import hash_string

ALGORITHM = "HS256"

def create_access_token(subject: int) -> Tuple[str, datetime]:
    expire = datetime.now(timezone.utc) + timedelta(minutes=int(settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    payload = {"sub": str(subject), "exp": int(expire.timestamp()), "type": "access"}
    token = jwt.encode(payload, settings.JWT_SECRET, algorithm=ALGORITHM)
    return token, expire

def create_refresh_token() -> Tuple[str, datetime]:
    token = secrets_token()
    expire = datetime.now(timezone.utc) + timedelta(days=int(settings.REFRESH_TOKEN_EXPIRE_DAYS))
    return token, expire

def secrets_token(length: int = 64) -> str:
    import secrets
    return secrets.token_urlsafe(length)

def hash_refresh_token(token: str) -> str:
    return hash_string(token)

def decode_token(token: str):
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise
    except Exception:
        raise
