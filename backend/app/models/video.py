from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from datetime import datetime

from app.database.database import Base


class Video(Base):
    __tablename__ = "videos"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(255), nullable=False)

    description = Column(Text, nullable=True)

    youtube_url = Column(String(500), nullable=False)

    thumbnail_url = Column(String(500), nullable=True)

    health_condition = Column(String(100), nullable=True)

    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime, default=datetime.utcnow)