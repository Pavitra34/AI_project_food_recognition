from pydantic import BaseModel

class BMIRequest(BaseModel):
    age: int
    gender: str
    height: float
    weight: float


class BMIResponse(BaseModel):
    age: int
    gender: str
    height: float
    weight: float

    bmi: float
    category: str
    ideal_weight: float