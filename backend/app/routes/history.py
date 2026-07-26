from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.services.history_service import get_history
from app.utils.jwt import verify_token

router = APIRouter(
    prefix="/api",
    tags=["History"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/history")
def history(
    authorization: str = Header(...),
    db: Session = Depends(get_db)
):
    try:
        token = authorization.replace("Bearer ", "")
        payload = verify_token(token)

        print("========== HISTORY API ==========")
        print("JWT Payload:", payload)

        return get_history(
            user_id=payload["user_id"],
            db=db
        )

    except Exception as e:
        print("History Error:", e)
        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )