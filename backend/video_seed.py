from app.database.database import SessionLocal
from app.models.video import Video


videos = [
  {"title":"Mayo Clinic Minute: 6 tips to healthy eating on a budget","description":"A Mayo Clinic nutritionist shares six practical tips for working healthy foods into your diet without overspending.","youtube_url":"https://www.youtube.com/watch?v=WViSvPFUVd8","thumbnail_url":"https://img.youtube.com/vi/WViSvPFUVd8/hqdefault.jpg","health_condition":"Healthy","is_active": True},
  {"title":"Keeping with your 2024 healthy eating resolutions with a Mayo Clinic dietitian","description":"A Mayo Clinic Health System dietitian shares tips for staying focused on healthy eating goals and overcoming common obstacles.","youtube_url":"https://www.youtube.com/watch?v=lzt8_iE9PvU","thumbnail_url":"https://img.youtube.com/vi/lzt8_iE9PvU/hqdefault.jpg","health_condition":"Healthy","is_active": True},
  {"title":"American Heart Association - Healthy Foods","description":"The American Heart Association highlights foods that support a heart-healthy, balanced diet.","youtube_url":"https://www.youtube.com/watch?v=VYFS2GwRMjc","thumbnail_url":"https://img.youtube.com/vi/VYFS2GwRMjc/hqdefault.jpg","health_condition":"Healthy","is_active": True},
  {"title":"Life's Essential 8: The checklist for lifelong good health","description":"Overview of the American Heart Association's Life's Essential 8 checklist for cardiovascular and overall health, including diet.","youtube_url":"https://www.youtube.com/watch?v=eunMfSD_ZKI","thumbnail_url":"https://img.youtube.com/vi/eunMfSD_ZKI/hqdefault.jpg","health_condition":"Healthy","is_active": True},
  {"title":"American Heart Association's National Eating Healthy Day","description":"The American Heart Association promotes balanced, nutritious meal-building for National Eating Healthy Day.","youtube_url":"https://www.youtube.com/watch?v=d6oVBMsNvP8","thumbnail_url":"https://img.youtube.com/vi/d6oVBMsNvP8/hqdefault.jpg","health_condition":"Healthy","is_active": True},

  {"title":"How to follow the American Diabetes Association's Plate Method?","description":"Explains the ADA plate method (50% non-starchy vegetables, 25% protein, 25% carbohydrates) for blood glucose management.","youtube_url":"https://www.youtube.com/watch?v=4Rxgjf0Yhj8","thumbnail_url":"https://img.youtube.com/vi/4Rxgjf0Yhj8/hqdefault.jpg","health_condition":"Diabetes","is_active": True},
  {"title":"Rethinking Your Plate with American Diabetes Association®","description":"The American Diabetes Association shares guidance on making healthy food choices to help manage diabetes.","youtube_url":"https://www.youtube.com/watch?v=vmjkdFOZj9E","thumbnail_url":"https://img.youtube.com/vi/vmjkdFOZj9E/hqdefault.jpg","health_condition":"Diabetes","is_active": True},
  {"title":"Diabetes? Stock up on these 5 nutrition-packed foods","description":"Mayo Clinic experts recommend five nutrient-dense foods to add to your grocery list for better diabetes nutrition.","youtube_url":"https://www.youtube.com/watch?v=-qoRA-4w65E","thumbnail_url":"https://img.youtube.com/vi/-qoRA-4w65E/hqdefault.jpg","health_condition":"Diabetes","is_active": True},
  {"title":"Learn to Make Chicken Stir-Fry | Diabetes Food Hub","description":"A diabetes-friendly, low-carb chicken stir-fry recipe from the American Diabetes Association's Diabetes Food Hub.","youtube_url":"https://www.youtube.com/watch?v=EEzL8WiOb1k","thumbnail_url":"https://img.youtube.com/vi/EEzL8WiOb1k/hqdefault.jpg","health_condition":"Diabetes","is_active": True},
  {"title":"Healthy eating when you have diabetes: Tips and tricks for balanced blood sugar and nutritious meals","description":"A registered dietitian and certified diabetes care and education specialist shares practical tips for balanced blood sugar and nutritious meals.","youtube_url":"https://www.youtube.com/watch?v=ZW_Ap0QelTo","thumbnail_url":"https://img.youtube.com/vi/ZW_Ap0QelTo/hqdefault.jpg","health_condition":"Diabetes","is_active": True},

  {"title":"What Is the DASH Diet?","description":"Cleveland Clinic explains the DASH (Dietary Approaches to Stop Hypertension) eating plan for lowering blood pressure and heart disease risk.","youtube_url":"https://www.youtube.com/watch?v=xqp02cfgU_U","thumbnail_url":"https://img.youtube.com/vi/xqp02cfgU_U/hqdefault.jpg","health_condition":"Hypertension","is_active": True},
  {"title":"Are There Natural Ways to Lower Blood Pressure? | Ask Cleveland Clinic's Expert","description":"A Cleveland Clinic expert discusses natural, lifestyle-based approaches to lowering high blood pressure.","youtube_url":"https://www.youtube.com/watch?v=cqLZhO06yeE","thumbnail_url":"https://img.youtube.com/vi/cqLZhO06yeE/hqdefault.jpg","health_condition":"Hypertension","is_active": True},
  {"title":"Mayo Clinic Minute: Hold the salt to help your heart","description":"Discusses sodium guidelines and why reducing salt intake matters for people with or at risk of high blood pressure.","youtube_url":"https://www.youtube.com/watch?v=LlrBP6O94k0","thumbnail_url":"https://img.youtube.com/vi/LlrBP6O94k0/hqdefault.jpg","health_condition":"Hypertension","is_active": True},
  {"title":"Mayo Clinic Minute: How to reduce salt in your diet","description":"A Mayo Clinic physician shares practical strategies for reducing sodium intake to help manage blood pressure.","youtube_url":"https://www.youtube.com/watch?v=Tbb-DDmncIs","thumbnail_url":"https://img.youtube.com/vi/Tbb-DDmncIs/hqdefault.jpg","health_condition":"Hypertension","is_active": True},
  {"title":"How can I lower my blood pressure without medication? Ask Mayo Clinic","description":"A Mayo Clinic nephrologist answers common questions about managing hypertension through lifestyle and diet.","youtube_url":"https://www.youtube.com/watch?v=NMuzXbyu7YY","thumbnail_url":"https://img.youtube.com/vi/NMuzXbyu7YY/hqdefault.jpg","health_condition":"Hypertension","is_active": True},

  {"title":"What Is the Best Diet for a Healthy Heart?","description":"Cleveland Clinic discusses the Mediterranean diet and other evidence-based dietary patterns for heart health.","youtube_url":"https://www.youtube.com/watch?v=irx4rjTHFVA","thumbnail_url":"https://img.youtube.com/vi/irx4rjTHFVA/hqdefault.jpg","health_condition":"Heart","is_active": True},
  {"title":"The Link Between Heart Health and Diet","description":"Cleveland Clinic explains how good nutrition supports heart health and what foods to prioritize.","youtube_url":"https://www.youtube.com/watch?v=FkMlghxoY_w","thumbnail_url":"https://img.youtube.com/vi/FkMlghxoY_w/hqdefault.jpg","health_condition":"Heart","is_active": True},
  {"title":"How to Lower Your Cholesterol | Leslie Cho, MD","description":"A Cleveland Clinic cardiologist explains cholesterol, the difference between 'good' and 'bad' cholesterol, and dietary strategies to lower it.","youtube_url":"https://www.youtube.com/watch?v=ICPWfxSJerk","thumbnail_url":"https://img.youtube.com/vi/ICPWfxSJerk/hqdefault.jpg","health_condition":"Heart","is_active": True},
  {"title":"Mayo Clinic Minute: How cholesterol affects your heart","description":"Explains what cholesterol is and how it affects heart health.","youtube_url":"https://www.youtube.com/watch?v=EeuRFSiI8jo","thumbnail_url":"https://img.youtube.com/vi/EeuRFSiI8jo/hqdefault.jpg","health_condition":"Heart","is_active": True},
  {"title":"Mayo Clinic Minute: Ideas for a heart-healthy diet","description":"Mayo Clinic shares practical ideas for building a heart-healthy diet.","youtube_url":"https://www.youtube.com/watch?v=GMYhl28dBfk","thumbnail_url":"https://img.youtube.com/vi/GMYhl28dBfk/hqdefault.jpg","health_condition":"Heart","is_active": True},

  {"title":"Diabetes, Heart and Kidney Disease: Diet and Lifestyle","description":"National Kidney Foundation experts discuss how diet and lifestyle choices affect the interconnected health of the heart, kidneys, and blood sugar.","youtube_url":"https://www.youtube.com/watch?v=6KETUmCR3GA","thumbnail_url":"https://img.youtube.com/vi/6KETUmCR3GA/hqdefault.jpg","health_condition":"Kidney","is_active": True},
  {"title":"Nutritional Strategies for Kidney Disease","description":"National Kidney Foundation experts share nutritional strategies to help manage kidney disease.","youtube_url":"https://www.youtube.com/watch?v=H6l5Yx9Eov8","thumbnail_url":"https://img.youtube.com/vi/H6l5Yx9Eov8/hqdefault.jpg","health_condition":"Kidney","is_active": True},
  {"title":"Mayo Clinic Minute: Can extra salt hurt your kidneys?","description":"Explains how excess sodium intake can affect kidney health.","youtube_url":"https://www.youtube.com/watch?v=zne8XW84pQU","thumbnail_url":"https://img.youtube.com/vi/zne8XW84pQU/hqdefault.jpg","health_condition":"Kidney","is_active": True},
  {"title":"Mayo Clinic Minute: What you can eat to help avoid getting kidney stones","description":"Mayo Clinic shares dietary tips to help reduce the risk of kidney stones.","youtube_url":"https://www.youtube.com/watch?v=CWJd7uaWZ_Q","thumbnail_url":"https://img.youtube.com/vi/CWJd7uaWZ_Q/hqdefault.jpg","health_condition":"Kidney","is_active": True},
  {"title":"Kidney Cancer Diet and Nutrition","description":"National Kidney Foundation experts discuss nutrition considerations for people managing kidney health.","youtube_url":"https://www.youtube.com/watch?v=kioGyp53F6Y","thumbnail_url":"https://img.youtube.com/vi/kioGyp53F6Y/hqdefault.jpg","health_condition":"Kidney","is_active": True},

  {"title":"Healthy Pregnancy Tips from CDC","description":"CDC shares essential tips for a healthy pregnancy, including prenatal vitamins and self-care.","youtube_url":"https://www.youtube.com/watch?v=fcHYARlb4Ko","thumbnail_url":"https://img.youtube.com/vi/fcHYARlb4Ko/hqdefault.jpg","health_condition":"Pregnant","is_active": True},
  {"title":"NHSGGC - Eating Well in Pregnancy – Plus the Right Vitamins","description":"NHS Greater Glasgow and Clyde explains what a healthy diet looks like during pregnancy and the role of Healthy Start vitamins.","youtube_url":"https://www.youtube.com/watch?v=oSsEeVFSecQ","thumbnail_url":"https://img.youtube.com/vi/oSsEeVFSecQ/hqdefault.jpg","health_condition":"Pregnant","is_active": True},
  {"title":"Mayo Clinic Minute - Pregnancy is no picnic when it comes to listeria","description":"Mayo Clinic explains why food safety, especially around listeria, is especially important during pregnancy.","youtube_url":"https://www.youtube.com/watch?v=ultQRQq3cm0","thumbnail_url":"https://img.youtube.com/vi/ultQRQq3cm0/hqdefault.jpg","health_condition":"Pregnant","is_active": True},
  {"title":"Mayo Clinic Guide to a Healthy Pregnancy - Biggest no-no's During Pregnancy","description":"A Mayo Clinic OB-GYN specialist discusses foods and activities to avoid during pregnancy.","youtube_url":"https://www.youtube.com/watch?v=4JirNGrwzDE","thumbnail_url":"https://img.youtube.com/vi/4JirNGrwzDE/hqdefault.jpg","health_condition":"Pregnant","is_active": True},
  {"title":"Mayo Clinic Minute: Pregnancy and toxoplasmosis","description":"Mayo Clinic explains the risk of toxoplasmosis infection during pregnancy and food-related precautions.","youtube_url":"https://www.youtube.com/watch?v=NxEIv-EeE94","thumbnail_url":"https://img.youtube.com/vi/NxEIv-EeE94/hqdefault.jpg","health_condition":"Pregnant","is_active": True}
]

def seed_videos():

    db = SessionLocal()

    try:

        # Avoid duplicate videos
        for video_data in videos:

            existing_video = db.query(Video).filter(
                Video.youtube_url == video_data["youtube_url"]
            ).first()

            if existing_video:
                print(f"Already exists: {video_data['title']}")
                continue

            video = Video(**video_data)

            db.add(video)

        db.commit()

        print("✅ Videos seeded successfully!")

    except Exception as e:

        db.rollback()
        print("❌ Error:", e)

    finally:

        db.close()


if __name__ == "__main__":
    seed_videos()