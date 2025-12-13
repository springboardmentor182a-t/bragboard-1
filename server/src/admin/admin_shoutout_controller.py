# server/src/admin/admin_shoutout_controller.py
from fastapi import APIRouter, HTTPException
from src.database import SessionLocal
from src.entities.shoutout import ShoutOut

router = APIRouter(prefix="/admin/shoutouts", tags=["admin-shoutouts"])

# -------------------------------
# Admin: Get all shoutouts
# -------------------------------
@router.get("/")
def get_all_shoutouts():
    db = SessionLocal()
    shoutouts = db.query(ShoutOut).all()
    db.close()
    return shoutouts

# -------------------------------
# Admin: Delete a shoutout
# -------------------------------
@router.delete("/{shoutout_id}")
def delete_shoutout(shoutout_id: int):
    db = SessionLocal()

    shoutout = db.query(ShoutOut).filter(ShoutOut.id == shoutout_id).first()
    if not shoutout:
        db.close()
        raise HTTPException(status_code=404, detail="Shoutout not found")

    db.delete(shoutout)
    db.commit()
    db.close()

    return {"message": "Shoutout deleted successfully"}
