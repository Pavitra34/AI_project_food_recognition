from sqlalchemy.orm import Session

from app.models.video import Video


def create_video(
    title: str,
    description: str,
    youtube_url: str,
    thumbnail_url: str,
    health_condition: str,
    db: Session
):
    video = Video(
        title=title,
        description=description,
        youtube_url=youtube_url,
        thumbnail_url=thumbnail_url,
        health_condition=health_condition,
        is_active=True
    )

    db.add(video)
    db.commit()
    db.refresh(video)

    return video


def get_videos(db: Session):
    return (
        db.query(Video)
        .filter(Video.is_active == True)
        .order_by(Video.created_at.desc())
        .all()
    )


def get_video(video_id: int, db: Session):
    return (
        db.query(Video)
        .filter(
            Video.id == video_id,
            Video.is_active == True
        )
        .first()
    )


def get_videos_by_condition(
    health_condition: str,
    db: Session
):
    return (
        db.query(Video)
        .filter(
            Video.health_condition == health_condition,
            Video.is_active == True
        )
        .order_by(Video.created_at.desc())
        .all()
    )