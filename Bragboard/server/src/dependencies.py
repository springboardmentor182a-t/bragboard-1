from src.database import SessionLocal

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
def get_current_user():
    return {"id": 1}
