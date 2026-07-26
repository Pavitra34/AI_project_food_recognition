import json
from pathlib import Path

import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.efficientnet import preprocess_input

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = BASE_DIR / "ml" / "efficientnetb0_100layers.keras"
CLASS_PATH = BASE_DIR / "ml" / "class_names.json"

print("Loading EfficientNetB0 model...")
model = tf.keras.models.load_model(MODEL_PATH)

with open(CLASS_PATH, "r") as f:
    class_names = json.load(f)

print(f"Model Loaded Successfully ({len(class_names)} classes)")


def predict_food(image_path: str):

    img = image.load_img(image_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)

    predictions = model.predict(img_array, verbose=0)

    predicted_index = np.argmax(predictions)
    confidence = float(predictions[0][predicted_index]) * 100
    food_name = class_names[predicted_index]

    print(f"Prediction: {food_name}")
    print(f"Confidence: {confidence:.2f}%")

    return {
        "food_name": food_name,
        "confidence": round(confidence, 2),
    }