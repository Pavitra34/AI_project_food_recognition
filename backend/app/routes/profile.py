from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.utils.jwt import verify_token

from app.schemas.profile_schema import (
    ProfileUpdateRequest,
    ProfileResponse,
)

from app.services.profile_service import (
    update_profile,
    get_profile,
)

router = APIRouter(
    prefix="/api/profile",
    tags=["Profile"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.put(
    "",
    response_model=ProfileResponse,
)
def update_user_profile(
    request: ProfileUpdateRequest,
    authorization: str = Header(...),
    db: Session = Depends(get_db),
):
    token = authorization.replace("Bearer ", "")

    payload = verify_token(token)

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid Token",
        )

    return update_profile(
        user_id=payload["user_id"],
        age=request.age,
        gender=request.gender,
        height=request.height,
        weight=request.weight,
        goal=request.goal,
        activity_level=request.activity_level,
        health_condition=request.health_condition,
        db=db,
    )


@router.get(
    "",
    response_model=ProfileResponse,
)
def get_user_profile(
    authorization: str = Header(...),
    db: Session = Depends(get_db),
):
    token = authorization.replace("Bearer ", "")

    payload = verify_token(token)

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid Token",
        )

    return get_profile(
        user_id=payload["user_id"],
        db=db,
    )