from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.database import SessionLocal
from src.auth import employee_required
from src.utils.jwt_handler import TokenData
from .schemas import ShoutOutCreate, ShoutOutOut, CommentCreate, CommentUpdate, CommentOut, ShoutOutUpdate
from .service import ShoutoutService
from typing import List

router = APIRouter(prefix="/shoutouts", tags=["Shout-Outs"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=ShoutOutOut)
def create_shoutout(
    data: ShoutOutCreate,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(employee_required)
):
    return ShoutoutService.create_shoutout(db, current_user.id, data)

@router.get("/", response_model=List[ShoutOutOut])
def list_shoutouts(
    view: str = "all", # "all", "toMe", "fromMe"
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(employee_required)
):
    return ShoutoutService.get_shoutouts(db, current_user.id, view)

@router.put("/{shoutout_id}", response_model=ShoutOutOut)
def update_shoutout(
    shoutout_id: int,
    data: ShoutOutUpdate,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(employee_required)
):
    try:
        shoutout = ShoutoutService.update_shoutout(db, current_user.id, shoutout_id, data)
        if not shoutout:
            raise HTTPException(status_code=404, detail="Shoutout not found")
        return shoutout
    except Exception as e:
        raise HTTPException(status_code=403, detail=str(e))

@router.delete("/{shoutout_id}")
def delete_shoutout(
    shoutout_id: int,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(employee_required)
):
    try:
        success = ShoutoutService.delete_shoutout(db, current_user.id, shoutout_id)
        if not success:
            raise HTTPException(status_code=404, detail="Shoutout not found")
        return {"message": "Shoutout deleted"}
    except Exception as e:
        raise HTTPException(status_code=403, detail=str(e))

@router.post("/{shoutout_id}/react")
def toggle_reaction(
    shoutout_id: int,
    reaction_type: str,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(employee_required)
):
    # reaction_type should be 'like', 'clap', or 'star'
    if reaction_type not in ['like', 'clap', 'star']:
        raise HTTPException(status_code=400, detail="Invalid reaction type")
    return ShoutoutService.toggle_reaction(db, current_user.id, shoutout_id, reaction_type)

@router.post("/{shoutout_id}/comments", response_model=CommentOut)
def add_comment(
    shoutout_id: int,
    data: CommentCreate,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(employee_required)
):
    return ShoutoutService.add_comment(db, current_user.id, shoutout_id, data)

@router.put("/comments/{comment_id}", response_model=CommentOut)
def update_comment(
    comment_id: int,
    data: CommentUpdate,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(employee_required)
):
    comment = ShoutoutService.update_comment(db, current_user.id, comment_id, data)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found or unauthorized")
    return comment

@router.delete("/comments/{comment_id}")
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(employee_required)
):
    success = ShoutoutService.delete_comment(db, current_user.id, comment_id)
    if not success:
        raise HTTPException(status_code=404, detail="Comment not found or unauthorized")
    return {"message": "Comment deleted"}
