from sqlalchemy.orm import Session

from app.models.user import User


def calculate_bmi(weight, height):
    height_m = height / 100
    bmi = round(weight / (height_m ** 2), 2)

    if bmi < 18.5:
        category = "Underweight"
    elif bmi < 25:
        category = "Normal"
    elif bmi < 30:
        category = "Overweight"
    else:
        category = "Obese"

    return bmi, category


def update_profile(
    user_id: int,
    age: int,
    gender: str,
    height: float,
    weight: float,
    goal: str,
    activity_level: str,
    db: Session,
):

    user = db.query(User).filter(User.id == user_id).first()

    bmi, category = calculate_bmi(weight, height)

    user.age = age
    user.gender = gender
    user.height = height
    user.weight = weight
    user.goal = goal
    user.activity_level = activity_level

    user.bmi = bmi
    user.bmi_category = category

    db.commit()
    db.refresh(user)

    return user


def get_profile(user_id: int, db: Session):

    return db.query(User).filter(User.id == user_id).first()