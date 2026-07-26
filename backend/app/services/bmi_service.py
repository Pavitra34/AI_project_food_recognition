from sqlalchemy.orm import Session

from app.models.bmi import BMI


def calculate_bmi(
    age: int,
    gender: str,
    height: float,
    weight: float,
    user_id: int,
    db: Session
):

    bmi = round(weight / (height * height), 2)

    if bmi < 18.5:
        category = "Underweight"
    elif bmi < 25:
        category = "Normal"
    elif bmi < 30:
        category = "Overweight"
    else:
        category = "Obese"

    ideal_weight = round(22 * (height * height), 2)

    bmi_data = BMI(
        user_id=user_id,
        age=age,
        gender=gender,
        height=height,
        weight=weight,
        bmi=bmi,
        category=category,
        ideal_weight=ideal_weight
    )

    db.add(bmi_data)
    db.commit()
    db.refresh(bmi_data)

    return {
        "age": age,
        "gender": gender,
        "height": height,
        "weight": weight,
        "bmi": bmi,
        "category": category,
        "ideal_weight": ideal_weight
    }