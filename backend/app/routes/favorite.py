from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.services.favorite_service import (
    add_favorite,
    get_favorites,
    remove_favorite
)
from app.utils.jwt import verify_token

router = APIRouter(
    prefix="/api/favorites",
    tags=["Favorites"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/{food_scan_id}")
def favorite_food(
    food_scan_id: int,
    authorization: str = Header(...),
    db: Session = Depends(get_db)
):
    token = authorization.replace("Bearer ", "")
    payload = verify_token(token)

    return add_favorite(
        user_id=payload["user_id"],
        food_scan_id=food_scan_id,
        db=db
    )


@router.get("")
def get_user_favorites(
    authorization: str = Header(...),
    db: Session = Depends(get_db)
):
    token = authorization.replace("Bearer ", "")
    payload = verify_token(token)

    return get_favorites(
        user_id=payload["user_id"],
        db=db
    )

@router.delete("/{food_scan_id}")
def delete_favorite(
    food_scan_id: int,
    authorization: str = Header(...),
    db: Session = Depends(get_db)
):
    token = authorization.replace("Bearer ", "")
    payload = verify_token(token)

    return remove_favorite(
        user_id=payload["user_id"],
        food_scan_id=food_scan_id,
        db=db
    )