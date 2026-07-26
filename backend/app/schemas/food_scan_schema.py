from pydantic import BaseModel
from datetime import datetime


class FoodScanResponse(BaseModel):
    id: int
    food_name: str
    confidence: float
    image_path: str
    created_at: datetime

    class Config:
        from_attributes = True