from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.user import User

from app.schemas.user_schema import (
    UserRegister,
    UserLogin,
    UpdateProfile,
    ChangePassword,
    ForgotPasswordRequest,
    ResetPasswordRequest
)

from app.services.auth_service import (
    register_user,
    login_user,
    update_profile,
    change_password,
    forgot_password,
    reset_password
)

from app.utils.jwt import verify_token


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# ==========================================
# REGISTER
# ==========================================

@router.post("/register")
def register(
    user: UserRegister,
    db: Session = Depends(get_db)
):
    return register_user(user, db)


# ==========================================
# LOGIN
# ==========================================

@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):
    return login_user(user, db)


# ==========================================
# FORGOT PASSWORD
# ==========================================

@router.post("/forgot-password")
def forgot_password_request(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    return forgot_password(
        request.email,
        db
    )


# ==========================================
# RESET PASSWORD
# ==========================================

@router.post("/reset-password")
def reset_password_route(
    data: ResetPasswordRequest,
    db: Session = Depends(get_db)
):

    return reset_password(
        data.email,
        data.reset_token,
        data.new_password,
        data.confirm_password,
        db
    )


# ==========================================
# GET PROFILE
# ==========================================

@router.get("/profile")
def get_profile(
    authorization: str = Header(...),
    db: Session = Depends(get_db)
):

    token = authorization.replace(
        "Bearer ",
        ""
    )

    payload = verify_token(token)

    if payload is None:
        return {
            "success": False,
            "message": "Invalid Token"
        }

    user = db.query(User).filter(
        User.id == payload["user_id"]
    ).first()

    if not user:
        return {
            "success": False,
            "message": "User not found"
        }

    return {
        "success": True,
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "phone": user.phone,
            "age": user.age,
            "gender": user.gender,
            "height": user.height,
            "weight": user.weight,
            "goal": user.goal,
            "activity_level": user.activity_level,
            "health_condition": user.health_condition,
            "bmi": user.bmi,
            "bmi_category": user.bmi_category
        }
    }


# ==========================================
# UPDATE PROFILE
# ==========================================

@router.put("/profile")
def update_user_profile(
    user: UpdateProfile,
    authorization: str = Header(...),
    db: Session = Depends(get_db)
):

    token = authorization.replace(
        "Bearer ",
        ""
    )

    payload = verify_token(token)

    if payload is None:
        return {
            "success": False,
            "message": "Invalid Token"
        }

    return update_profile(
        payload["user_id"],
        user,
        db
    )


# ==========================================
# CHANGE PASSWORD
# ==========================================

@router.put("/change-password")
def update_password(
    password: ChangePassword,
    authorization: str = Header(...),
    db: Session = Depends(get_db)
):

    token = authorization.replace(
        "Bearer ",
        ""
    )

    payload = verify_token(token)

    if payload is None:
        return {
            "success": False,
            "message": "Invalid Token"
        }

    return change_password(
        payload["user_id"],
        password,
        db
    )