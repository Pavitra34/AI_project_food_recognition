from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.user_schema import UserRegister
from app.database.database import get_db
from app.services.auth_service import register_user
from app.schemas.user_schema import UserRegister, UserLogin, UpdateProfile, ChangePassword
from app.services.auth_service import register_user, login_user,update_profile,change_password
from fastapi import APIRouter, Depends, Header
from app.utils.jwt import verify_token
from app.models.user import User

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register(
    user: UserRegister,
    db: Session = Depends(get_db)
):
    return register_user(user, db)

@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):
    return login_user(user, db)

@router.get("/profile")
def get_profile(
    authorization: str = Header(...),
    db: Session = Depends(get_db)
):

    token = authorization.replace("Bearer ", "")

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
            "phone": user.phone
        }
    }

@router.put("/profile")
def update_user_profile(
    user: UpdateProfile,
    authorization: str = Header(...),
    db: Session = Depends(get_db)
):
    token = authorization.replace("Bearer ", "")

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
@router.put("/change-password")
def update_password(
    password: ChangePassword,
    authorization: str = Header(...),
    db: Session = Depends(get_db)
):

    token = authorization.replace("Bearer ", "")

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
