from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import Base, engine, SessionLocal
from models import User  # adjust import as needed
from utils import hash_password, verify_password, export_shoutouts_csv, export_shoutouts_pdf
from auth import get_current_admin, SECRET_KEY, ALGORITHM
from jose import jwt
import io
from datetime import datetime
from entities.shoutout import Shoutout

Base.metadata.create_all(bind=engine)
app = FastAPI(title="Export Reports API")

# DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Admin creation at startup
@app.on_event("startup")
def create_admin_user():
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.username=="admin").first()
        if not user:
            new_user = User(username="admin", hashed_password=hash_password("1234"))
            db.add(new_user)
            db.commit()
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
def export_reports(
    department: str = Query(..., description="Department name"),
    from_date: str = Query(..., description="Start date YYYY-MM-DD"),
    to_date: str = Query(..., description="End date YYYY-MM-DD"),
    format: str = Query("csv", description="csv or pdf"),
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin)
):
    # Validate date format
    try:
        from_dt = datetime.strptime(from_date, "%Y-%m-%d")
        to_dt = datetime.strptime(to_date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")

    # Filter shoutouts by department and date range
    shoutouts_db = db.query(Shoutout).filter(
        Shoutout.department == department,
        Shoutout.created_at >= from_dt,
        Shoutout.created_at <= to_dt
    ).all()

    if not shoutouts_db:
        raise HTTPException(status_code=404, detail="No shoutouts found for the given filters.")

    # Convert to list of dicts
    shoutouts = [
        {"id": s.id, "sender": s.sender, "receiver": s.receiver, "message": s.message, "created_at": s.created_at}
        for s in shoutouts_db
    ]

    # Export CSV
    if format == "csv":
        csv_data = export_shoutouts_csv(shoutouts)
        return StreamingResponse(io.StringIO(csv_data), media_type="text/csv",
                                 headers={"Content-Disposition": f"attachment; filename=shoutouts_{department}_{from_date}_{to_date}.csv"})
    # Export PDF
    elif format == "pdf":
        pdf_buffer = export_shoutouts_pdf(shoutouts)
        return StreamingResponse(pdf_buffer, media_type="application/pdf",
                                 headers={"Content-Disposition": f"attachment; filename=shoutouts_{department}_{from_date}_{to_date}.pdf"})
    else:
        raise HTTPException(status_code=400, detail="Invalid format. Use 'csv' or 'pdf'.")
