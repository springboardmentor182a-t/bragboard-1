from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database.core import get_db
from entities.shoutout import (
    ShoutoutCreate,
    ShoutoutResponse,
    ShoutoutUpdate,
    ShoutoutAdminResponse,
)

from shoutouts.service import (
    create_shoutout,
    get_shoutout,
    get_all_shoutouts,
    get_all_shoutouts_paginated,
    update_shoutout,
    delete_shoutout,
    soft_delete_shoutout,
    restore_shoutout,
)
from fastapi import HTTPException
from reactions_module.crud import add_or_toggle_reaction, get_counts as get_reaction_counts
from reactions_module.schemas import ReactionCreate, ReactionCount

router = APIRouter(prefix="/shoutouts", tags=["Shoutouts"])


@router.post("/", response_model=ShoutoutResponse)
def create(data: ShoutoutCreate, db: Session = Depends(get_db)):
    return create_shoutout(db, data)


@router.get("/{shoutout_id}", response_model=ShoutoutResponse)
def read(shoutout_id: int, db: Session = Depends(get_db)):
    s = get_shoutout(db, shoutout_id)
    if not s:
        raise HTTPException(status_code=404, detail="Shoutout not found")
    return s


@router.get("/", response_model=list[ShoutoutResponse])
def read_all(db: Session = Depends(get_db)):
    return get_all_shoutouts(db)


@router.put("/{shoutout_id}", response_model=ShoutoutResponse)
def update(shoutout_id: int, data: ShoutoutUpdate, db: Session = Depends(get_db)):
    s = update_shoutout(db, shoutout_id, data)
    if not s:
        raise HTTPException(status_code=404, detail="Shoutout not found")
    return s


@router.delete("/{shoutout_id}")
def delete(shoutout_id: int, db: Session = Depends(get_db)):
    s = delete_shoutout(db, shoutout_id)
    if not s:
        raise HTTPException(status_code=404, detail="Shoutout not found")
    return s


@router.get("/{shoutout_id}/reactions", response_model=ReactionCount)
def get_reactions(shoutout_id: int, db: Session = Depends(get_db)):
    """Get all reaction counts for a shoutout."""
    return get_reaction_counts(db, "shoutout", shoutout_id)


@router.post("/{shoutout_id}/reaction/{reaction_type}", response_model=ReactionCount)
def react(shoutout_id: int, reaction_type: str, db: Session = Depends(get_db), user_id: int | None = None):
    """Toggle a reaction for a shoutout. The request may include `user_id` as a query param."""
    # Build ReactionCreate using the same field names as the Reaction model/schema
    data = ReactionCreate(shoutout_type="shoutout", shoutout_id=shoutout_id, user_id=user_id, reaction_type=reaction_type)
    try:
        return add_or_toggle_reaction(db, data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


admin_router = APIRouter(prefix="/admin/shoutouts", tags=["Admin Shoutouts"])


@admin_router.get("/", response_model=list[ShoutoutAdminResponse])
def admin_list_shoutouts(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=500),
    include_deleted: bool = Query(False),
    db: Session = Depends(get_db),
):
    items, _total = get_all_shoutouts_paginated(db, page=page, page_size=page_size, include_deleted=include_deleted)
    return items


@admin_router.get("/{shoutout_id}", response_model=ShoutoutResponse)
def admin_get_shoutout(shoutout_id: int, db: Session = Depends(get_db)):
    s = get_shoutout(db, shoutout_id)
    if not s:
        raise HTTPException(status_code=404, detail="Shoutout not found")
    return s


@admin_router.delete("/{shoutout_id}", status_code=204)
def admin_delete_shoutout(shoutout_id: int, db: Session = Depends(get_db)):
    s = delete_shoutout(db, shoutout_id)
    if not s:
        raise HTTPException(status_code=404, detail="Shoutout not found")
    return None


@admin_router.patch("/{shoutout_id}/soft", response_model=ShoutoutAdminResponse)
def admin_soft_delete_shoutout(shoutout_id: int, db: Session = Depends(get_db)):
    s = soft_delete_shoutout(db, shoutout_id)
    if not s:
        raise HTTPException(status_code=404, detail="Shoutout not found")
    return s


@admin_router.patch("/{shoutout_id}/restore", response_model=ShoutoutAdminResponse)
def admin_restore_shoutout(shoutout_id: int, db: Session = Depends(get_db)):
    s = restore_shoutout(db, shoutout_id)
    if not s:
        raise HTTPException(status_code=404, detail="Shoutout not found")
    return s
