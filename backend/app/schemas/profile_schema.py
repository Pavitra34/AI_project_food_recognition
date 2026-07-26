from pydantic import BaseModel


class ProfileUpdateRequest(BaseModel):
    age: int
    gender: str
    height: float
    weight: float
    goal: str
    activity_level: str


from pydantic import BaseModel

class ProfileResponse(BaseModel):
    full_name: str
    email: str

    age: int | None = None
    gender: str | None = None
    height: float | None = None
    weight: float | None = None

    goal: str | None = None
    activity_level: str | None = None

    bmi: float | None = None
    bmi_category: str | None = None

    class Config:
        from_attributes = True