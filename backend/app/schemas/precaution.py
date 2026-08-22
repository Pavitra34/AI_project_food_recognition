from pydantic import BaseModel
from typing import Optional


class PrecautionCreate(BaseModel):
    title: str
    description: str
    image_url: Optional[str] = None
    health_condition: str
    is_active: bool = True


class PrecautionResponse(BaseModel):
    id: int
    title: str
    description: str
    image_url: Optional[str]
    health_condition: str
    is_active: bool

    class Config:
        from_attributes = True