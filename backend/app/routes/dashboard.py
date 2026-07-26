from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.services.dashboard_service import get_dashboard

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
def dashboard(db: Session = Depends(get_db)):
    return get_dashboard(user_id=1, db=db)