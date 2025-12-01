from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session, Session
from sqlalchemy.ext.declarative import declarative_base

DATABASE_URL = "sqlite:///./bragboard.db"

engine = create_engine(
    DATABASE_URL,
    echo=True,
    connect_args={"check_same_thread": False},
)

session_factory = sessionmaker(bind=engine, autoflush=False, autocommit=False)
SessionLocal = scoped_session(session_factory)

Base = declarative_base()

# ✅ ADD THIS
def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
