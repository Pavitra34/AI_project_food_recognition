from sqlalchemy.orm import Session

from app.models.food_scan import FoodScan
from app.models.nutrition_log import NutritionLog


def get_history(user_id: int, db: Session):

    print("Requested User ID:", user_id)

    scans = (
        db.query(FoodScan)
        .filter(FoodScan.user_id == user_id)
        .order_by(FoodScan.id.desc())
        .all()
    )

    print("Scans Found:", len(scans))

    history = []

    for scan in scans:

        nutrition = (
            db.query(NutritionLog)
            .filter(
                NutritionLog.food_scan_id == scan.id
            )
            .first()
        )

        image_path = scan.image_path.replace("\\", "/")

        if image_path.startswith("app/"):
            image_path = image_path.replace(
                "app",
                "",
                1
            )

        history.append({
            "scan_id": scan.id,
            "food_name": scan.food_name,
            "confidence": scan.confidence,
            "image_path": image_path,
            "created_at": scan.created_at.isoformat() if scan.created_at else None,
            "nutrition": {
                "calories": nutrition.calories if nutrition else 0,
                "protein": nutrition.protein if nutrition else 0,
                "carbs": nutrition.carbs if nutrition else 0,
                "fat": nutrition.fat if nutrition else 0,
                "fiber": nutrition.fiber if nutrition else 0,
                "sugar": nutrition.sugar if nutrition else 0
            }
        })

    print("History Response:", history)

    return history