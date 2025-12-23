from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from database.core import SessionLocal
from auth.dependencies import get_current_admin
from auth.models import User


router = APIRouter(
    prefix="/admin",
    tags=["admin"]
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
# Get Pending User Approvals
# ------------------------------
@router.get("/users/pending")
def get_pending_users(
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get pending user approvals - Admin only"""
    try:
        # Get users with pending status
        pending_users = db.query(User).filter(User.status == "pending").all()
        
        return {
            "status": "success",
            "data": [
                {
                    "id": u.id,
                    "name": u.name,
                    "email": u.email,
                    "role": u.role,
                    "status": u.status
                }
                for u in pending_users
            ]
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


# ------------------------------
# Approve User
# ------------------------------
@router.post("/users/{user_id}/approve")
def approve_user(
    user_id: int,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Approve a pending user - Admin only"""
    try:
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        user.status = "approved"
        user.is_approved = True
        user.approved_at = datetime.utcnow()
        user.approved_by = current_user.id
        
        db.commit()
        
        return {
            "status": "success",
            "message": f"User {user.email} approved successfully"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


# ------------------------------
# Reject User
# ------------------------------
@router.post("/users/{user_id}/reject")
def reject_user(
    user_id: int,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Reject a pending user - Admin only"""
    try:
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        user.status = "rejected"
        user.is_approved = False
        
        db.commit()
        
        return {
            "status": "success",
            "message": f"User {user.email} rejected"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


# ------------------------------
# Get All Users
# ------------------------------
@router.get("/users")
def get_all_users(
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all users - Admin only"""
    try:
        users = db.query(User).all()
        return {
            "status": "success",
            "data": [
                {
                    "id": u.id,
                    "name": u.name,
                    "email": u.email,
                    "role": u.role,
                    "is_approved": u.is_approved
                }
                for u in users
            ]
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
