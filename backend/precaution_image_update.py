from app.database.database import SessionLocal
from app.models.precaution import Precaution


db = SessionLocal()

images = {
    # Healthy
    1: "healthy1.webp",
    2: "healthy2.jpg",
    3: "healthy3.jpg",
    4: "healthy4.jpg",
    5: "healthy5.jpg",

    # Diabetes
    6: "diabet1.avif",
    7: "diabets2.jpg",
    8: "diabets 3.jpg",
    9: "diabets4.png",
    10: "diabets 5.jpg",

    # Hypertension
    11: "hyper1.jpg",
    12: "hyper2.jpg",
    13: "hyper3.jpg",
    14: "hyper4.jpg",
    15: "hyper5.jpg",

    # Heart
    16: "heart1.jpg",
    17: "heart2.jpg",
    18: "heart3.jpg",
    19: "heart4.webp",
    20: "heart5.webp",

    # Kidney
    21: "kidney1.jpg",
    22: "kidney2.avif",
    23: "kidney3.jpg",
    24: "kidney4.jpg",
    25: "kidney5.avif",

    # Pregnant
    26: "pregnent1.jpg",
    27: "preg2.jpg",
    28: "preg3.webp",
    29: "preg4.webp",
    30: "preg5.jpg",
}


for precaution_id, filename in images.items():

    precaution = db.query(Precaution).filter(
        Precaution.id == precaution_id
    ).first()

    if precaution:
        precaution.image_url = f"/uploads/precautions/{filename}"


db.commit()
db.close()

print("✅ Precaution images updated successfully!")