from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date

from app.models.food_scan import FoodScan
from app.models.nutrition_log import NutritionLog


def get_dashboard(user_id: int, db: Session):

    scans = (
        db.query(FoodScan)
        .filter(FoodScan.user_id == user_id)
        .order_by(FoodScan.id.desc())
        .all()
    )

    total_scans = len(scans)

    today = date.today()

    calories = 0
    protein = 0
    carbs = 0
    fat = 0

    recent_foods = []

    for scan in scans[:5]:

        recent_foods.append(scan.food_name)

        nutrition = (
            db.query(NutritionLog)
            .filter(NutritionLog.food_scan_id == scan.id)
            .first()
        )

        if nutrition:
            calories += nutrition.calories
            protein += nutrition.protein
            carbs += nutrition.carbs
            fat += nutrition.fat

    return {
        "total_scans": total_scans,
        "today_calories": calories,
        "today_protein": protein,
        "today_carbs": carbs,
        "today_fat": fat,
        "recent_foods": recent_foods
    }