def calculate_daily_goals(user):
    """
    Calculate personalized daily nutrition goals
    """

    if (
        user.age is None
        or user.height is None
        or user.weight is None
        or user.gender is None
        or user.activity_level is None
    ):
        return {
            "calories": 0,
            "protein": 0,
            "carbs": 0,
            "fat": 0,
            "water": 0,
        }

    # -----------------------------
    # BMR (Mifflin St Jeor Formula)
    # -----------------------------
    if user.gender.lower() == "male":
        bmr = (
            10 * user.weight
            + 6.25 * user.height
            - 5 * user.age
            + 5
        )
    else:
        bmr = (
            10 * user.weight
            + 6.25 * user.height
            - 5 * user.age
            - 161
        )

    # -----------------------------
    # Activity Multiplier
    # -----------------------------
    activity = {
        "Light": 1.375,
        "Moderate": 1.55,
        "Active": 1.725,
    }

    calories = bmr * activity.get(
        user.activity_level,
        1.375
    )

    # -----------------------------
    # Goal Adjustment
    # -----------------------------
    if user.goal == "Weight Gain":
        calories += 300

    elif user.goal == "Weight Loss":
        calories -= 400

    elif user.goal == "Muscle Gain":
        calories += 250

    # Maintain → no change

    # -----------------------------
    # Macronutrients
    # -----------------------------
    protein = user.weight * 1.2

    carbs = calories * 0.50 / 4

    fat = calories * 0.25 / 9

    water = user.weight * 35

    return {
        "calories": round(calories),
        "protein": round(protein),
        "carbs": round(carbs),
        "fat": round(fat),
        "water": round(water),
    }