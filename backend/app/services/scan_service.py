import os
import shutil
import uuid

from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session

from app.models.food_scan import FoodScan
from app.models.nutrition_log import NutritionLog
from app.services.ai_service import predict_food
from app.services.nutrition_service import get_food_nutrition
from app.models.user import User
from app.services.recommendation_service import get_recommendation
from datetime import datetime, timedelta

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

    print("========== PREDICTION ==========")
    print(prediction)

    # Confidence check
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

    # Nutrition
    nutrition = get_food_nutrition(prediction["food_name"])

    if nutrition is None:
        nutrition = {
            "calories": 0,
            "protein": 0,
            "carbs": 0,
            "fat": 0,
            "fiber": 0,
            "sugar": 0,
        }

    # Get User
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        if os.path.exists(image_path):
            os.remove(image_path)

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # -----------------------------------
    # Check Duplicate Scan For Today
    # -----------------------------------

    today_start = datetime.now().replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0
    )

    tomorrow = today_start + timedelta(days=1)

    existing_scan = (
        db.query(FoodScan)
        .filter(
            FoodScan.user_id == user_id,
            FoodScan.food_name == prediction["food_name"],
            FoodScan.created_at >= today_start,
            FoodScan.created_at < tomorrow,
        )
        .first()
    )

    if existing_scan:
        if os.path.exists(image_path):
            os.remove(image_path)

        raise HTTPException(
            status_code=409,
            detail=f"You have already scanned '{prediction['food_name']}' today."
        )

    print("========== USER ==========")
    print("Goal :", user.goal)
    print("Health Condition :", user.health_condition)
    print("BMI :", user.bmi)

    print("========== NUTRITION ==========")
    print(nutrition)

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

    # Recommendation
    recommendation = get_recommendation(
        nutrition=nutrition,
        goal=user.goal,
        health_condition=user.health_condition,
        bmi=user.bmi,
    )

    print("========== RECOMMENDATION ==========")
    print(recommendation)

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
        "nutrition": nutrition,
        "recommendation": recommendation
    }


    
