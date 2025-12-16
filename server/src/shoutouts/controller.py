from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from src.database.core import get_db
from src.entities.shoutout import (
    ShoutoutCreate,
    ShoutoutResponse,
    ShoutoutUpdate,
)

from src.shoutouts.service import (
    create_shoutout,
    get_shoutout,
    get_all_shoutouts,
    get_all_shoutouts_paginated,
    update_shoutout,
    delete_shoutout,
)

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


admin_router = APIRouter(prefix="/admin/shoutouts", tags=["Admin Shoutouts"])


@admin_router.get("/", response_model=list[ShoutoutResponse])
def admin_list_shoutouts(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
):
    items, _total = get_all_shoutouts_paginated(db, page=page, page_size=page_size)
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
