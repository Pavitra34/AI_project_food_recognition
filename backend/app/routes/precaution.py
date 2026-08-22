from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.schemas.precaution import (
    PrecautionCreate,
    PrecautionResponse
)
from app.services.precaution_service import (
    create_precaution,
    get_all_precautions,
    get_precautions_by_condition,
    get_single_precaution
)


router = APIRouter(
    prefix="/api/precautions",
    tags=["Precautions"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post(
    "",
    response_model=PrecautionResponse
)
def add_precaution(
    data: PrecautionCreate,
    db: Session = Depends(get_db)
):

    return create_precaution(data, db)


@router.get(
    "",
    response_model=list[PrecautionResponse]
)
def get_precautions(
    db: Session = Depends(get_db)
):

    return get_all_precautions(db)


@router.get(
    "/condition/{health_condition}",
    response_model=list[PrecautionResponse]
)
def get_condition_precautions(
    health_condition: str,
    db: Session = Depends(get_db)
):

    return get_precautions_by_condition(
        health_condition,
        db
    )


@router.get(
    "/{precaution_id}",
    response_model=PrecautionResponse
)
def get_precaution(
    precaution_id: int,
    db: Session = Depends(get_db)
):

    precaution = get_single_precaution(
        precaution_id,
        db
    )

    if not precaution:
        raise HTTPException(
            status_code=404,
            detail="Precaution not found"
        )

    return precaution