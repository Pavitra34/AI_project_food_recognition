from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from datetime import datetime

from app.database.database import Base


class Precaution(Base):
    __tablename__ = "precautions"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(255), nullable=False)

    description = Column(Text, nullable=False)

    image_url = Column(String(500), nullable=True)

    health_condition = Column(String(100), nullable=False, index=True)

    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime, default=datetime.utcnow)