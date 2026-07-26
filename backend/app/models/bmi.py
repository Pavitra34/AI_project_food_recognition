from sqlalchemy import Column, Integer, Float, String, ForeignKey, DateTime
from sqlalchemy.sql import func

from app.database.database import Base


class BMI(Base):
    __tablename__ = "bmi"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    age = Column(Integer)

    gender = Column(String(20))

    height = Column(Float)

    weight = Column(Float)

    bmi = Column(Float)

    category = Column(String(50))

    ideal_weight = Column(Float)

    created_at = Column(DateTime(timezone=True), server_default=func.now())