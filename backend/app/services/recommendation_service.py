def get_recommendation(
    nutrition,
    goal,
    health_condition,
    bmi,
):
    calories = nutrition.get("calories", 0)
    sugar = nutrition.get("sugar", 0)
    protein = nutrition.get("protein", 0)
    fat = nutrition.get("fat", 0)
    carbs = nutrition.get("carbs", 0)
    sodium = nutrition.get("sodium", 0)
    cholesterol = nutrition.get("cholesterol", 0)

    status = "Suitable"
    reason = "This food is suitable."

    # -------------------------------
    # Health Condition Priority
    # -------------------------------

    if health_condition == "Diabetes":

        if sugar >= 15:
            status = "Avoid"
            reason = "High sugar content is not recommended for diabetes."

        elif carbs >= 30:
            status = "Consume in Moderation"
            reason = "High carbohydrate content may increase blood glucose levels."

        elif sodium >= 500:
            status = "Consume in Moderation"
            reason = "High sodium intake should be limited."

        else:
            status = "Suitable"
            reason = "Low sugar and moderate carbohydrate food."

    elif health_condition == "Hypertension":

        if sodium >= 500:
            status = "Avoid"
            reason = "High sodium food is not recommended for hypertension."

        elif sodium >= 300:
            status = "Consume in Moderation"
            reason = "Moderate sodium content."

        else:
            status = "Suitable"
            reason = "Low sodium food."

    elif health_condition == "Heart Disease":

        if fat >= 15 or cholesterol >= 50:
            status = "Avoid"
            reason = "High fat or cholesterol food is not recommended."

        elif fat >= 8:
            status = "Consume in Moderation"
            reason = "Moderate fat content."

        else:
            status = "Suitable"
            reason = "Low fat food."

    # -------------------------------
    # Goal Based Recommendation
    # -------------------------------

    elif goal == "Weight Loss":

        if calories >= 400:
            status = "Consume in Moderation"
            reason = "High calorie food may slow weight loss."

        else:
            status = "Suitable"
            reason = "Suitable for a weight loss diet."

    elif goal == "Weight Gain":

        if calories >= 350:
            status = "Suitable"
            reason = "High calorie food supports weight gain."

        elif calories >= 200:
            status = "Consume in Moderation"
            reason = "Moderate calorie food."

        else:
            status = "Suitable"
            reason = "Can be included in a weight gain diet."

    elif goal == "Muscle Gain":

        if protein >= 20:
            status = "Suitable"
            reason = "High protein food supports muscle growth."

        elif protein >= 10:
            status = "Consume in Moderation"
            reason = "Moderate protein content."

        else:
            status = "Consume in Moderation"
            reason = "Protein content is relatively low."

    return {
        "status": status,
        "reason": reason
    }