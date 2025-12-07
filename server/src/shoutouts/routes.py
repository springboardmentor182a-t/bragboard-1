from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from database import get_db
from entities.admin_shoutouts import Shoutout

class ShoutoutListResponse(BaseModel):
    id: int
    content: str
    sender_id: int
    receiver_id: int
    sender_name: str = "Unknown Sender"
    receiver_name: str = "Unknown Receiver"
    created_at: datetime
    
    @classmethod
    def from_shoutout(cls, shoutout: Shoutout):
        return cls(
            id=shoutout.id,
            content=shoutout.content,
            sender_id=shoutout.sender_id or 0,
            receiver_id=shoutout.receiver_id or 0,
            sender_name="Unknown Sender",
            receiver_name="Unknown Receiver",
            created_at=shoutout.created_at
        )

class ShoutoutDetailResponse(ShoutoutListResponse):
    sender_email: str = "sender@example.com"
    receiver_email: str = "receiver@example.com"

class PaginatedShoutouts(BaseModel):
    items: List[ShoutoutListResponse]
    total: int
    page: int
    page_size: int
    total_pages: int

router = APIRouter(prefix="/admin/shoutouts", tags=["Admin Shoutouts"])

@router.get("", response_model=PaginatedShoutouts)
def list_shoutouts(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=50),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    offset = (page - 1) * page_size
    
    query = db.query(Shoutout).filter(Shoutout.is_deleted == False)
    
    if search:
        query = query.filter(
            or_(
                Shoutout.content.ilike(f"%{search}%"),
                Shoutout.id == int(search) if search.isdigit() else False
            )
        )
    
    query = query.order_by(desc(Shoutout.created_at))
    
    total = query.count()
    items = query.offset(offset).limit(page_size).all()
    
    return PaginatedShoutouts(
        items=[ShoutoutListResponse.from_shoutout(item) for item in items],  # ✅ Fixed
        total=total,
        page=page,
        page_size=page_size,
        total_pages=(total + page_size - 1) // page_size
    )

@router.get("/{shoutout_id}", response_model=ShoutoutDetailResponse)
def get_shoutout_detail(shoutout_id: int, db: Session = Depends(get_db)):
    shoutout = db.query(Shoutout).filter(
        Shoutout.id == shoutout_id,
        Shoutout.is_deleted == False
    ).first()
    
    if not shoutout:
        raise HTTPException(status_code=404, detail="Shoutout not found")
    
    return ShoutoutDetailResponse.from_shoutout(shoutout)

@router.delete("/{shoutout_id}", status_code=204)
def delete_shoutout(shoutout_id: int, db: Session = Depends(get_db)):
    shoutout = db.query(Shoutout).filter(
        Shoutout.id == shoutout_id,
        Shoutout.is_deleted == False
    ).first()
    
    if not shoutout:
        raise HTTPException(status_code=404, detail="Shoutout not found")
    
    shoutout.is_deleted = True
    shoutout.deleted_at = datetime.utcnow()
    db.commit()
    
    return None
