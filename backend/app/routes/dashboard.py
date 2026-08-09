from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.services.dashboard_service import get_dashboard
from app.utils.jwt import verify_token


router = APIRouter(
    prefix="/api",
    tags=["Dashboard"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.get("/dashboard")
def dashboard(
    authorization: str = Header(...),
    db: Session = Depends(get_db)
):

    token = authorization.replace("Bearer ", "")

    payload = verify_token(token)

    if payload is None:
        return {
            "success": False,
            "message": "Invalid Token"
        }

    return get_dashboard(
        user_id=payload["user_id"],
        db=db
    )