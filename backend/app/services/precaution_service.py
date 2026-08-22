from sqlalchemy.orm import Session

from app.models.precaution import Precaution


def create_precaution(data, db: Session):

    precaution = Precaution(
        title=data.title,
        description=data.description,
        image_url=data.image_url,
        health_condition=data.health_condition,
        is_active=data.is_active
    )

    db.add(precaution)
    db.commit()
    db.refresh(precaution)

    return precaution


def get_all_precautions(db: Session):

    return db.query(Precaution).filter(
        Precaution.is_active == True
    ).all()


def get_precautions_by_condition(
    health_condition: str,
    db: Session
):

    return db.query(Precaution).filter(
        Precaution.health_condition.ilike(health_condition),
        Precaution.is_active == True
    ).all()


def get_single_precaution(
    precaution_id: int,
    db: Session
):

    return db.query(Precaution).filter(
        Precaution.id == precaution_id
    ).first()