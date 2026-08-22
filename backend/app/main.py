from fastapi import FastAPI
from app.database.database import engine, Base
from app.routes.auth import router as auth_router
from app.models.user import User
from app.models.food_scan import FoodScan
from app.models.nutrition_log import NutritionLog
from app.routes.scan import router as scan_router
from app.routes.history import router as history_router
from app.routes.dashboard import router as dashboard_router
from app.models.bmi import BMI
from app.routes.bmi import router as bmi_router
from app.routes.profile import router as profile_router
from fastapi.staticfiles import StaticFiles
from app.models.favorite import Favorite
from app.models.video import Video
from app.routes.favorite import router as favorite_router
from app.routes.chat import router as chat_router
from app.routes.videos import router as video_router
from app.models.precaution import Precaution
from app.routes.precaution import router as precaution_router
from app.models.precaution import Precaution
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NutriScan API",
    version="1.0.0"
)
app.include_router(auth_router)

@app.get("/")
def root():
    return {
        "message": "NutriScan Backend Running Successfully"
    }

app.include_router(scan_router)
app.include_router(history_router)
app.include_router(dashboard_router)
app.include_router(bmi_router)
app.include_router(profile_router)
app.include_router(favorite_router)
app.include_router(chat_router)
app.include_router(video_router)
app.include_router(precaution_router)
from fastapi.staticfiles import StaticFiles

app.mount(
    "/uploads",
    StaticFiles(directory="app/uploads"),
    name="uploads"
)