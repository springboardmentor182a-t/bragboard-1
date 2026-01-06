from typing import Generator

from sqlalchemy.orm import Session

from .core import SessionLocal


def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency that provides a database session and
    makes sure it is closed after the request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
