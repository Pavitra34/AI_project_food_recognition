from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.sql import func

from app.database.database import Base


class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    food_scan_id = Column(
        Integer,
        ForeignKey("food_scans.id"),
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )