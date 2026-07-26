from sqlalchemy.orm import Session

from app.models.favorite import Favorite
from app.models.food_scan import FoodScan
from app.models.nutrition_log import NutritionLog


def _format_scan(scan: FoodScan, db: Session) -> dict:
    nutrition = (
        db.query(NutritionLog)
        .filter(NutritionLog.food_scan_id == scan.id)
        .first()
    )

    image_path = scan.image_path.replace("\\", "/")

    if image_path.startswith("app/"):
        image_path = image_path.replace("app", "", 1)

    return {
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
            "sugar": nutrition.sugar if nutrition else 0,
        },
    }


def add_favorite(user_id: int, food_scan_id: int, db: Session):

    favorite = db.query(Favorite).filter(
        Favorite.user_id == user_id,
        Favorite.food_scan_id == food_scan_id
    ).first()

    if favorite:
        return {
            "message": "Already in favorites"
        }

    favorite = Favorite(
        user_id=user_id,
        food_scan_id=food_scan_id
    )

    db.add(favorite)
    db.commit()
    db.refresh(favorite)

    return {
        "message": "Added to favorites"
    }


def get_favorites(user_id: int, db: Session):

    scans = (
        db.query(FoodScan)
        .join(
            Favorite,
            Favorite.food_scan_id == FoodScan.id
        )
        .filter(Favorite.user_id == user_id)
        .order_by(Favorite.created_at.desc())
        .all()
    )

    return [_format_scan(scan, db) for scan in scans]


def remove_favorite(user_id: int, food_scan_id: int, db: Session):

    favorite = db.query(Favorite).filter(
        Favorite.user_id == user_id,
        Favorite.food_scan_id == food_scan_id
    ).first()

    if not favorite:
        return {
            "message": "Favorite not found"
        }

    db.delete(favorite)
    db.commit()

    return {
        "message": "Removed from favorites"
    }
