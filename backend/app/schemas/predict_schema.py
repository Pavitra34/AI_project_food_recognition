from pydantic import BaseModel


class ScanResponse(BaseModel):

    food_name: str

    confidence: float

    image_path: str

    calories: float

    protein: float

    carbs: float

    fat: float

    fiber: float

    sugar: float