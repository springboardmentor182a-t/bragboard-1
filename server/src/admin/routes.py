from fastapi import APIRouter, Depends, HTTPException
from src import admin
from src.entities import user
from sqlalchemy.orm import Session
from datetime import datetime

from src.database.core import SessionLocal
from src.auth.models import User
from src.auth.dependencies import get_current_user
from src.admin_logs.models import AdminLog


router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)

# ------------------------------
# Database Dependency
# ------------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ------------------------------
# Admin Access Guard
# ------------------------------
def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )
    return current_user


# ------------------------------
# Get Pending User Approvals
# STEP 1.4
# ------------------------------
@router.get("/users/pending")
def get_pending_users(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    users = db.query(User).filter(User.status == "pending").all()

    return [
        {
            "id": user.id,
            "email": user.email,
            "role": user.role,
            "is_verified": user.is_verified,
            "status": user.status
        }
        for user in users
    ]


# ------------------------------
# Approve User
# ------------------------------
@router.post("/users/{user_id}/approve")
def approve_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if user.status == "approved":
        raise HTTPException(
            status_code=400,
            detail="User already approved"
        )

    user.is_approved = True
    user.status = "approved"
    user.approved_at = datetime.utcnow()
    user.approved_by = admin.id

    log = AdminLog(
    admin_id=admin.id,
    action="APPROVE_USER",
    target_id=user.id,
    target_type="User"
    )

    db.add(log)
    db.commit()


    return {"msg": "User approved successfully"}


# ------------------------------
# Reject User
# ------------------------------
@router.post("/users/{user_id}/reject")
def reject_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if user.status == "rejected":
        raise HTTPException(
            status_code=400,
            detail="User already rejected"
        )

    user.is_approved = False
    user.status = "rejected"

    log = AdminLog(
    admin_id=admin.id,
    action="REJECT_USER",
    target_id=user.id,
    target_type="User"
    )

    db.add(log)
    db.commit()


    return {"msg": "User rejected successfully"}
