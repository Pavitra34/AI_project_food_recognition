import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("USDA_API_KEY")

SEARCH_URL = "https://api.nal.usda.gov/fdc/v1/foods/search"


def get_food_nutrition(food_name: str):

    # Food-101 class names → USDA search format
    FOOD_MAPPING = {
        "fried_rice": "fried rice",
        "apple_pie": "apple pie",
        "macaroni_and_cheese": "macaroni and cheese",
        "grilled_cheese_sandwich": "grilled cheese sandwich",
        "eggs_benedict": "eggs benedict",
        "fish_and_chips": "fish and chips",
        "beef_carpaccio": "beef carpaccio",
        "chicken_curry": "chicken curry",
    }

    search_name = FOOD_MAPPING.get(
        food_name,
        food_name.replace("_", " ")
    )

    print(f"Searching USDA: {search_name}")

    params = {
        "query": search_name,
        "api_key": API_KEY,
        "pageSize": 1
    }

    response = requests.get(SEARCH_URL, params=params)

    if response.status_code != 200:
        print("USDA API Error:", response.status_code)
        return None

    data = response.json()

    print("USDA Response:", data)

    if not data.get("foods"):
        print("No food found in USDA")
        return None

    food = data["foods"][0]

    print("Matched Food:", food.get("description"))

    nutrients = {}

    for item in food.get("foodNutrients", []):
        nutrients[item["nutrientName"]] = item.get("value", 0)

    return {
        "calories": nutrients.get("Energy", 0),
        "protein": nutrients.get("Protein", 0),
        "carbs": nutrients.get("Carbohydrate, by difference", 0),
        "fat": nutrients.get("Total lipid (fat)", 0),
        "fiber": nutrients.get("Fiber, total dietary", 0),
        "sugar": nutrients.get("Sugars, total including NLEA", 0),
    }