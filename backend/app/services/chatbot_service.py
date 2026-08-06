import google.generativeai as genai

from app.core.config import GEMINI_API_KEY
from app.models.user import User

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

# Gemini Model
model = genai.GenerativeModel("models/gemini-3.6-flash")


SYSTEM_PROMPT = """
You are NutriScan AI, a professional nutrition assistant.

Rules:

- Answer ONLY food, nutrition, BMI, calories, exercise and healthy lifestyle questions.
- Always personalize your answer using the user's health profile.
- Recommend foods according to the user's goal.
- If the user has any health condition, give safe recommendations.
- Never recommend anything unsafe.

RESPONSE STYLE:

- Keep answers between 40 and 80 words.
- Use simple English.
- Use short paragraphs.
- Give only the most important advice.
- Avoid long explanations.
- Avoid repeating the user's profile.
- Mention the user's goal or health condition only if it is relevant.
- Use at most 3 bullet points when needed.
- End with one practical recommendation.

If the question is unrelated to health or nutrition, reply only:

"Sorry, I can only answer nutrition and health related questions."
IMPORTANT RESPONSE RULES:

- Reply in under 80 words.
- Do not write essays.
- Do not use markdown headings.
- Keep the answer concise and mobile-friendly.
- Focus only on the user's question.
- Mention the user's health profile only when necessary.
"""


def ask_chatbot(
    message: str,
    user: User,
):
    try:

        profile = f"""
User Profile

Name: {user.full_name}

Age: {user.age}

Gender: {user.gender}

Height: {user.height} cm

Weight: {user.weight} kg

BMI: {user.bmi}

BMI Category: {user.bmi_category}

Goal: {user.goal}

Activity Level: {user.activity_level}

Health Condition: {user.health_condition}

Daily Calories: {user.daily_calories}

Daily Protein: {user.daily_protein}

Daily Carbs: {user.daily_carbs}

Daily Fat: {user.daily_fat}

Daily Water: {user.daily_water} ml
"""

        prompt = f"""
{SYSTEM_PROMPT}

The following is the user's health profile.

{profile}

Always answer according to the user's profile.

If the user has diabetes, heart disease, obesity, underweight or any other health condition, tailor your answer accordingly.

If the user's goal is Weight Loss, recommend foods suitable for weight loss.

If the user's goal is Weight Gain, recommend foods suitable for weight gain.

User Question:

{message}
"""

        # ==========================
        # DEBUG LOGS
        # ==========================
        print("\n========== USER PROFILE ==========")
        print(profile)

        print("\n========== USER QUESTION ==========")
        print(message)

        print("\n========== FINAL PROMPT ==========")
        print(prompt)

        print("\n========== SENDING TO GEMINI ==========\n")

        response = model.generate_content(prompt)

        print("\n========== GEMINI RESPONSE ==========")
        print(response.text)

        if hasattr(response, "text") and response.text:
            return response.text

        return "Sorry, I couldn't generate a response."

    except Exception as e:
        print("\n========== GEMINI ERROR ==========")
        print(e)

        return "Sorry, AI service is currently unavailable."