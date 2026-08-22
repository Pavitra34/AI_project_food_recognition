from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import SessionLocal

from app.services.video_service import (
    create_video,
    get_videos,
    get_video,
    get_videos_by_condition
)

router = APIRouter(
    prefix="/api/videos",
    tags=["Videos"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("")
def add_video(
    title: str,
    description: str,
    youtube_url: str,
    thumbnail_url: str,
    health_condition: str,
    db: Session = Depends(get_db)
):
    return create_video(
        title=title,
        description=description,
        youtube_url=youtube_url,
        thumbnail_url=thumbnail_url,
        health_condition=health_condition,
        db=db
    )


@router.get("")
def get_all_videos(
    db: Session = Depends(get_db)
):
    return get_videos(db)

@router.get("/condition/{health_condition}")
def get_condition_videos(
    health_condition: str,
    db: Session = Depends(get_db)
):
    return get_videos_by_condition(
        health_condition=health_condition,
        db=db
    )


@router.get("/{video_id}")
def get_single_video(
    video_id: int,
    db: Session = Depends(get_db)
):
    return get_video(
        video_id=video_id,
        db=db
    )


