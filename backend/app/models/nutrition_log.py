from sqlalchemy import Column, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship

from app.database.database import Base


class NutritionLog(Base):
    __tablename__ = "nutrition_logs"

    id = Column(Integer, primary_key=True, index=True)

    food_scan_id = Column(Integer, ForeignKey("food_scans.id"))

    calories = Column(Float, default=0)

    protein = Column(Float, default=0)

    carbs = Column(Float, default=0)

    fat = Column(Float, default=0)

    fiber = Column(Float, default=0)

    sugar = Column(Float, default=0)

    food_scan = relationship("FoodScan", back_populates="nutrition")