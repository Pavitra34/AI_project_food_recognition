from sqlalchemy.orm import Session

from app.models.user import User
from app.services.nutrition_goal_service import calculate_daily_goals


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
    health_condition: str,
    db: Session,
):

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        return None

    # -----------------------------
    # Update User Profile
    # -----------------------------
    user.age = age
    user.gender = gender
    user.height = height
    user.weight = weight
    user.goal = goal
    user.activity_level = activity_level
    user.health_condition = health_condition

    # -----------------------------
    # Calculate BMI
    # -----------------------------
    bmi, category = calculate_bmi(weight, height)

    user.bmi = bmi
    user.bmi_category = category

    # -----------------------------
    # Calculate Daily Nutrition Goals
    # -----------------------------
    goals = calculate_daily_goals(user)

    print("\n========== DAILY GOALS ==========")
    print(goals)

    # -----------------------------
    # Save Daily Goals
    # -----------------------------
    user.daily_calories = goals["calories"]
    user.daily_protein = goals["protein"]
    user.daily_carbs = goals["carbs"]
    user.daily_fat = goals["fat"]
    user.daily_water = goals["water"]

    print("\n========== BEFORE COMMIT ==========")
    print("Calories :", user.daily_calories)
    print("Protein  :", user.daily_protein)
    print("Carbs    :", user.daily_carbs)
    print("Fat      :", user.daily_fat)
    print("Water    :", user.daily_water)

    db.commit()
    db.refresh(user)

    print("\n========== AFTER COMMIT ==========")
    print("Calories :", user.daily_calories)
    print("Protein  :", user.daily_protein)
    print("Carbs    :", user.daily_carbs)
    print("Fat      :", user.daily_fat)
    print("Water    :", user.daily_water)

    return user


def get_profile(user_id: int, db: Session):
    return db.query(User).filter(User.id == user_id).first()