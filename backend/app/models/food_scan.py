from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database.database import Base


class FoodScan(Base):
    __tablename__ = "food_scans"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    image_path = Column(String, nullable=False)

    food_name = Column(String, nullable=False)

    confidence = Column(Float, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="food_scans")

    nutrition = relationship(
        "NutritionLog",
        back_populates="food_scan",
        uselist=False,
        cascade="all, delete"
    )