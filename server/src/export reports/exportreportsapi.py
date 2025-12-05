from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import Base, engine, SessionLocal
from models import User, Shoutout
from utils import hash_password, verify_password, export_shoutouts_csv, export_shoutouts_pdf
from auth import get_current_admin, SECRET_KEY, ALGORITHM
from jose import jwt
import io

Base.metadata.create_all(bind=engine)
app = FastAPI(title="Export Reports API")

# DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Robust admin creation at startup
@app.on_event("startup")
def create_admin_user():
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.username=="admin").first()
        if not user:
            new_user = User(username="admin", hashed_password=hash_password("1234"))
            db.add(new_user)
            db.commit()
    except Exception as e:
        print("Admin creation skipped:", e)
    finally:
        db.close()

# Login endpoint
@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username==form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    access_token = jwt.encode({"sub": user.username}, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": access_token, "token_type": "bearer"}


# Export Reports API (Admin-only)
@app.get("/export_reports")
def export_reports(format: str = "csv", db: Session = Depends(get_db), admin: str = Depends(get_current_admin)):
    shoutouts_db = db.query(Shoutout).all()
    shoutouts = [
        {"id": s.id, "sender": s.sender, "receiver": s.receiver, "message": s.message, "created_at": s.created_at}
        for s in shoutouts_db
    ]
    if not shoutouts:
        return {"message": "No shoutouts available to export"}
    if format == "csv":
        csv_data = export_shoutouts_csv(shoutouts)
        return StreamingResponse(io.StringIO(csv_data), media_type="text/csv",
                                 headers={"Content-Disposition": "attachment; filename=shoutouts.csv"})
    elif format == "pdf":
        pdf_buffer = export_shoutouts_pdf(shoutouts)
        return StreamingResponse(pdf_buffer, media_type="application/pdf",
                                 headers={"Content-Disposition": "attachment; filename=shoutouts.pdf"})
    else:
        return {"error": "Invalid format. Use 'csv' or 'pdf'."}
