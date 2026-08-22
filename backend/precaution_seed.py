from app.database.database import SessionLocal
from app.models.precaution import Precaution


precautions = [

    # =========================
    # HEALTHY - 5
    # =========================

    {
        "title": "Eat a Balanced Diet",
        "description": "Include a variety of fruits, vegetables, whole grains, lean proteins, and healthy fats in your daily meals to support overall health.",
        "image_url": "/uploads/precautions/healthy1.webp",
        "health_condition": "Healthy",
        "is_active": True
    },
    {
        "title": "Practice Portion Control",
        "description": "Pay attention to portion sizes at meals and snacks to help maintain a healthy weight and avoid overeating.",
        "image_url": "/uploads/precautions/healthy2.jpg",
        "health_condition": "Healthy",
        "is_active": True
    },
    {
        "title": "Stay Physically Active",
        "description": "Aim for regular physical activity, such as brisk walking, most days of the week to support overall wellbeing.",
        "image_url": "/uploads/precautions/healthy3.jpg",
        "health_condition": "Healthy",
        "is_active": True
    },
    {
        "title": "Stay Hydrated",
        "description": "Drink enough water throughout the day to stay well hydrated and support your body's normal functions.",
        "image_url": "/uploads/precautions/healthy4.jpg",
        "health_condition": "Healthy",
        "is_active": True
    },
    {
        "title": "Prioritize Sleep and Manage Stress",
        "description": "Aim for consistent, quality sleep and healthy stress-management habits to support your overall wellbeing.",
        "image_url": "/uploads/precautions/healthy5.jpg",
        "health_condition": "Healthy",
        "is_active": True
    },


    # =========================
    # DIABETES - 5
    # =========================

    {
        "title": "Limit Added Sugars and Refined Carbs",
        "description": "Reducing added sugars and refined carbohydrates can help support more stable blood sugar levels.",
        "image_url": "/uploads/precautions/diabet1.avif",
        "health_condition": "Diabetes",
        "is_active": True
    },
    {
        "title": "Eat Regular, Portioned Meals",
        "description": "Eating balanced meals at regular times with consistent portions can help support steady blood sugar levels.",
        "image_url": "/uploads/precautions/diabets2.jpg",
        "health_condition": "Diabetes",
        "is_active": True
    },
    {
        "title": "Monitor Your Blood Glucose",
        "description": "Regularly checking your blood glucose, as advised by your healthcare provider, helps you understand how food and activity affect your levels.",
        "image_url": "/uploads/precautions/diabets 3.jpg",
        "health_condition": "Diabetes",
        "is_active": True
    },
    {
        "title": "Stay Physically Active",
        "description": "Regular physical activity can help support blood sugar management. Check with your healthcare provider before starting a new activity routine.",
        "image_url": "/uploads/precautions/diabets4.png",
        "health_condition": "Diabetes",
        "is_active": True
    },
    {
        "title": "Follow Your Care Plan and Attend Check-ups",
        "description": "Take medicines as prescribed by your doctor and attend regular check-ups. Always consult your healthcare provider before making any changes to your treatment.",
        "image_url": "/uploads/precautions/diabets 5.jpg",
        "health_condition": "Diabetes",
        "is_active": True
    },


    # =========================
    # HYPERTENSION - 5
    # =========================

    {
        "title": "Reduce Sodium and Salt Intake",
        "description": "Cutting back on sodium and salty foods may help support healthy blood pressure levels.",
        "image_url": "/uploads/precautions/hyper1.jpg",
        "health_condition": "Hypertension",
        "is_active": True
    },
    {
        "title": "Maintain a Healthy Weight",
        "description": "Reaching and maintaining a healthy weight through balanced eating and activity can support healthy blood pressure.",
        "image_url": "/uploads/precautions/hyper2.jpg",
        "health_condition": "Hypertension",
        "is_active": True
    },
    {
        "title": "Stay Physically Active",
        "description": "Regular physical activity can support healthy blood pressure. Check with your healthcare provider before starting a new exercise plan.",
        "image_url": "/uploads/precautions/hyper3.jpg",
        "health_condition": "Hypertension",
        "is_active": True
    },
    {
        "title": "Limit Alcohol Intake",
        "description": "Limiting alcohol may help support healthy blood pressure levels.",
        "image_url": "/uploads/precautions/hyper4.jpg",
        "health_condition": "Hypertension",
        "is_active": True
    },
    {
        "title": "Monitor Blood Pressure Regularly",
        "description": "Check your blood pressure regularly and follow the treatment plan set by your healthcare provider.",
        "image_url": "/uploads/precautions/hyper5.jpg",
        "health_condition": "Hypertension",
        "is_active": True
    },


    # =========================
    # HEART - 5
    # =========================

    {
        "title": "Follow a Heart-Healthy Diet",
        "description": "A diet rich in fruits, vegetables, whole grains, and lean proteins can help support heart health.",
        "image_url": "/uploads/precautions/heart1.jpg",
        "health_condition": "Heart",
        "is_active": True
    },
    {
        "title": "Limit Saturated and Trans Fats",
        "description": "Reducing saturated and trans fats in your diet may help support healthy cholesterol levels.",
        "image_url": "/uploads/precautions/heart2.jpg",
        "health_condition": "Heart",
        "is_active": True
    },
    {
        "title": "Stay Physically Active",
        "description": "Regular physical activity supports cardiovascular health. Check with your healthcare provider before starting a new exercise routine.",
        "image_url": "/uploads/precautions/heart3.jpg",
        "health_condition": "Heart",
        "is_active": True
    },
    {
        "title": "Avoid Smoking and Tobacco",
        "description": "Avoiding smoking and tobacco use supports better heart and overall health.",
        "image_url": "/uploads/precautions/heart4.webp",
        "health_condition": "Heart",
        "is_active": True
    },
    {
        "title": "Monitor Blood Pressure and Cholesterol",
        "description": "Regularly monitoring your blood pressure and cholesterol, with guidance from your healthcare provider, supports heart health.",
        "image_url": "/uploads/precautions/heart5.webp",
        "health_condition": "Heart",
        "is_active": True
    },


    # =========================
    # KIDNEY - 5
    # =========================

    {
        "title": "Reduce Sodium Intake",
        "description": "Lowering sodium intake may support kidney health. Individual needs vary, so consult your healthcare provider or dietitian for personalized guidance.",
        "image_url": "/uploads/precautions/kidney1.jpg",
        "health_condition": "Kidney",
        "is_active": True
    },
    {
        "title": "Follow Individualized Protein Guidance",
        "description": "Protein needs vary widely for people with kidney concerns. Follow personalized protein guidance from your healthcare provider or dietitian.",
        "image_url": "/uploads/precautions/kidney2.avif",
        "health_condition": "Kidney",
        "is_active": True
    },
    {
        "title": "Monitor Potassium and Phosphorus",
        "description": "Potassium and phosphorus needs differ from person to person. Monitor these nutrients only as advised by your healthcare provider or dietitian.",
        "image_url": "/uploads/precautions/kidney3.jpg",
        "health_condition": "Kidney",
        "is_active": True
    },
    {
        "title": "Follow Individualized Fluid Guidance",
        "description": "Fluid needs vary for people with kidney concerns. Follow the fluid intake guidance provided by your healthcare provider.",
        "image_url": "/uploads/precautions/kidney4.jpg",
        "health_condition": "Kidney",
        "is_active": True
    },
    {
        "title": "Attend Regular Kidney Health Monitoring",
        "description": "Attend regular check-ups and tests to monitor kidney health, as recommended by your healthcare provider.",
        "image_url": "/uploads/precautions/kidney5.avif",
        "health_condition": "Kidney",
        "is_active": True
    },


    # =========================
    # PREGNANT - 5
    # =========================

    {
        "title": "Follow Food Safety Practices",
        "description": "Follow safe food-handling practices, such as thoroughly cooking meat and washing produce, to help reduce the risk of foodborne illness during pregnancy.",
        "image_url": "/uploads/precautions/pregnent1.jpg",
        "health_condition": "Pregnant",
        "is_active": True
    },
    {
        "title": "Avoid Alcohol and Tobacco",
        "description": "Avoiding alcohol and tobacco during pregnancy supports the health of both you and your baby.",
        "image_url": "/uploads/precautions/preg2.jpg",
        "health_condition": "Pregnant",
        "is_active": True
    },
    {
        "title": "Choose Lower-Mercury Fish",
        "description": "Choose fish that are lower in mercury and limit or avoid high-mercury fish during pregnancy. Ask your healthcare provider for personalized guidance.",
        "image_url": "/uploads/precautions/preg3.webp",
        "health_condition": "Pregnant",
        "is_active": True
    },
    {
        "title": "Follow Prenatal Nutrition Advice",
        "description": "Nutrient and supplement needs vary during pregnancy. Follow prenatal nutrition and supplement advice from your healthcare provider.",
        "image_url": "/uploads/precautions/preg4.webp",
        "health_condition": "Pregnant",
        "is_active": True
    },
    {
        "title": "Attend Regular Prenatal Check-ups",
        "description": "Attend all recommended prenatal check-ups to help monitor the health of you and your baby.",
        "image_url": "/uploads/precautions/preg5.jpg",
        "health_condition": "Pregnant",
        "is_active": True
    }
]


db = SessionLocal()

try:

    for data in precautions:

        existing = db.query(Precaution).filter(
            Precaution.title == data["title"],
            Precaution.health_condition == data["health_condition"]
        ).first()

        if existing:
            print(f"Already exists: {data['title']}")
            continue

        precaution = Precaution(**data)

        db.add(precaution)

    db.commit()

    print("✅ Precautions seeded successfully!")

except Exception as e:

    db.rollback()

    print("❌ Error while seeding precautions:")
    print(e)

finally:

    db.close()