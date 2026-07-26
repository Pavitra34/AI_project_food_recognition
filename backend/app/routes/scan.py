from fastapi import APIRouter, UploadFile, File, Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.services.scan_service import scan_food
from app.utils.jwt import verify_token

router = APIRouter(
    prefix="/api",
    tags=["Food Scan"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/scan")
def upload_food(
    authorization: str = Header(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    print("========== SCAN ==========")

    token = authorization.replace("Bearer ", "")
    print("TOKEN:", token)

    payload = verify_token(token)
    print("PAYLOAD:", payload)

    return scan_food(
        file=file,
        user_id=payload["user_id"],
        db=db
    )