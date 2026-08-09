from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from app.models.food_scan import FoodScan
from app.models.nutrition_log import NutritionLog


def get_dashboard(user_id: int, db: Session):

    # ==========================================
    # TODAY DATE RANGE
    # ==========================================

    today_start = datetime.now().replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0
    )

    tomorrow = today_start + timedelta(days=1)

    # ==========================================
    # ALL SCANS
    # Used only for total scan count
    # ==========================================

    total_scans = (
        db.query(FoodScan)
        .filter(
            FoodScan.user_id == user_id
        )
        .count()
    )

    # ==========================================
    # TODAY'S SCANS ONLY
    # ==========================================

    today_scans = (
        db.query(FoodScan)
        .filter(
            FoodScan.user_id == user_id,
            FoodScan.created_at >= today_start,
            FoodScan.created_at < tomorrow
        )
        .order_by(FoodScan.created_at.desc())
        .all()
    )

    # ==========================================
    # TODAY'S NUTRITION ONLY
    # ==========================================

    calories = 0
    protein = 0
    carbs = 0
    fat = 0

    for scan in today_scans:

        nutrition = (
            db.query(NutritionLog)
            .filter(
                NutritionLog.food_scan_id == scan.id
            )
            .first()
        )

        if nutrition:

            calories += nutrition.calories or 0
            protein += nutrition.protein or 0
            carbs += nutrition.carbs or 0
            fat += nutrition.fat or 0

    # ==========================================
    # RECENT FOODS
    # Old scans can still be shown here
    # ==========================================

    recent_scans = (
        db.query(FoodScan)
        .filter(
            FoodScan.user_id == user_id
        )
        .order_by(FoodScan.created_at.desc())
        .limit(5)
        .all()
    )

    recent_foods = [
        scan.food_name
        for scan in recent_scans
    ]

    # ==========================================
    # RESPONSE
    # ==========================================

    return {
        "total_scans": total_scans,

        # TODAY ONLY
        "today_calories": calories,
        "today_protein": protein,
        "today_carbs": carbs,
        "today_fat": fat,

        # Recent scans
        "recent_foods": recent_foods,
    }