import os
import shutil
import uuid

from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session

from app.models.food_scan import FoodScan
from app.models.nutrition_log import NutritionLog
from app.services.ai_service import predict_food
from app.services.nutrition_service import get_food_nutrition

UPLOAD_FOLDER = "app/uploads/food"
CONFIDENCE_THRESHOLD = 50

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def save_image(file: UploadFile):
    extension = file.filename.split(".")[-1]

    filename = f"{uuid.uuid4()}.{extension}"

    filepath = os.path.join(UPLOAD_FOLDER, filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return filepath


def scan_food(file: UploadFile, user_id: int, db: Session):

    # Save uploaded image
    image_path = save_image(file)

    # AI Prediction
    prediction = predict_food(image_path)

    print("Prediction:", prediction)

    # Confidence threshold check before saving or fetching nutrition
    if prediction["confidence"] < CONFIDENCE_THRESHOLD:
        if os.path.exists(image_path):
            os.remove(image_path)

        raise HTTPException(
            status_code=422,
            detail=(
                f"Food could not be detected with enough confidence "
                f"({prediction['confidence']}%). "
                f"Minimum required is {CONFIDENCE_THRESHOLD}%."
            ),
        )

    # Get Nutrition
    nutrition = get_food_nutrition(
        prediction["food_name"]
    )

    print("Nutrition:", nutrition)

    # If nutrition not found
    if nutrition is None:
        nutrition = {
            "calories": 0,
            "protein": 0,
            "carbs": 0,
            "fat": 0,
            "fiber": 0,
            "sugar": 0,
        }

    # Save Food Scan
    food_scan = FoodScan(
        user_id=user_id,
        image_path=image_path,
        food_name=prediction["food_name"],
        confidence=prediction["confidence"]
    )

    db.add(food_scan)
    db.commit()
    db.refresh(food_scan)

    # Save Nutrition
    nutrition_log = NutritionLog(
        food_scan_id=food_scan.id,
        calories=nutrition["calories"],
        protein=nutrition["protein"],
        carbs=nutrition["carbs"],
        fat=nutrition["fat"],
        fiber=nutrition["fiber"],
        sugar=nutrition["sugar"]
    )

    db.add(nutrition_log)
    db.commit()

    return {
        "scan_id": food_scan.id,
        "food_name": food_scan.food_name,
        "confidence": food_scan.confidence,
        "image_path": food_scan.image_path,
        "nutrition": nutrition
    }