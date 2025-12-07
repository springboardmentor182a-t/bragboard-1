from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import engine, get_db
from entities.comments import Base as CommentBase
from entities.shoutouts import Base as ShoutoutBase
from comments.routes import router as comments_router
from analytics.routes import router as analytics_router
from shoutouts import routes as admin_shoutouts
from fastapi.middleware.cors import CORSMiddleware
from entities.shoutouts import Shoutout

app = FastAPI()

# Create ALL tables on startup
CommentBase.metadata.create_all(bind=engine)
ShoutoutBase.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(comments_router)
app.include_router(analytics_router)
app.include_router(admin_shoutouts.router)

@app.get("/")
def root():
    return {"message": "API running ✅"}

# Test endpoints - REMOVE after testing
@app.post("/test-shoutouts")
def create_test_shoutout(db: Session = Depends(get_db)):
    shoutout = Shoutout(
        content="Great job team! 🚀", 
        sender_id=1, 
        receiver_id=2
    )
    db.add(shoutout)
    db.commit()
    db.refresh(shoutout)
    return {"id": shoutout.id, "message": "Shoutout created!"}

@app.get("/debug-db")
def debug_db(db: Session = Depends(get_db)):
    result = db.execute("SELECT name FROM sqlite_master WHERE type='table';").fetchall()
    tables = [row[0] for row in result]
    shoutouts_count = db.query(Shoutout).filter(Shoutout.is_deleted == False).count()
    return {
        "tables": tables, 
        "shoutouts_count": shoutouts_count,
        "shoutouts_endpoint": "/admin/shoutouts"
    }
