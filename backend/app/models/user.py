from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import relationship
from app.database.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)

    age = Column(Integer, nullable=True)
    gender = Column(String(20), nullable=True)
    height = Column(Float, nullable=True)
    weight = Column(Float, nullable=True)
    goal = Column(String(50), nullable=True)
    activity_level = Column(String(50), nullable=True)
    health_condition = Column(String(100), nullable=True)

    bmi = Column(Float, nullable=True)
    bmi_category = Column(String(30), nullable=True)

    food_scans = relationship(
        "FoodScan",
        back_populates="user",
        cascade="all, delete"
    )