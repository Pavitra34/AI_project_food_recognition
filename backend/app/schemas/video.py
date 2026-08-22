from pydantic import BaseModel
from typing import Optional


class VideoCreate(BaseModel):
    title: str
    description: Optional[str] = None
    youtube_url: str
    thumbnail_url: Optional[str] = None
    health_condition: Optional[str] = None


class VideoResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    youtube_url: str
    thumbnail_url: Optional[str] = None
    health_condition: Optional[str] = None
    is_active: bool

    class Config:
        from_attributes = True