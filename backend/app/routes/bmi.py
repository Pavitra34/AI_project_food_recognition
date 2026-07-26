from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.schemas.bmi_schema import BMIRequest
from app.services.bmi_service import calculate_bmi

router = APIRouter(
    prefix="/api",
    tags=["BMI"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/bmi")
def bmi(
    request: BMIRequest,
    db: Session = Depends(get_db)
):
    return calculate_bmi(
        age=request.age,
        gender=request.gender,
        height=request.height,
        weight=request.weight,
        user_id=1,   # Temporary
        db=db
    )