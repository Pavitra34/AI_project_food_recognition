from pydantic import BaseModel


class NutritionResponse(BaseModel):
    calories: float
    protein: float
    carbs: float
    fat: float
    fiber: float
    sugar: float

    class Config:
        from_attributes = True