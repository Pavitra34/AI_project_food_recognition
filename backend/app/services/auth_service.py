from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user_schema import UserRegister, UserLogin,UpdateProfile,ChangePassword
from app.utils.helper import hash_password, verify_password
from app.utils.jwt import create_access_token


def register_user(user: UserRegister, db: Session):

    # Full Name Validation
    if len(user.full_name.strip()) < 3:
        return {
            "success": False,
            "message": "Full name must be at least 3 characters"
        }

    # Password Match Validation
    if user.password != user.confirm_password:
        return {
            "success": False,
            "message": "Passwords do not match"
        }

    # Password Length Validation
    if len(user.password) < 8:
        return {
            "success": False,
            "message": "Password must be at least 8 characters"
        }

    # Email Duplicate Check
    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        return {
            "success": False,
            "message": "Email already exists"
        }

    # Phone Duplicate Check
    existing_phone = db.query(User).filter(User.phone == user.phone).first()

    if existing_phone:
        return {
            "success": False,
            "message": "Phone number already exists"
        }

    # Create User
    new_user = User(
        full_name=user.full_name,
        email=user.email,
        phone=user.phone,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "success": True,
        "message": "User Registered Successfully",
        "user": {
            "id": new_user.id,
            "full_name": new_user.full_name,
            "email": new_user.email,
            "phone": new_user.phone
        }
    }


def login_user(user: UserLogin, db: Session):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not existing_user:
        return {
            "success": False,
            "message": "Invalid Email or Password"
        }

    if not verify_password(
        user.password,
        existing_user.password
    ):
        return {
            "success": False,
            "message": "Invalid Email or Password"
        }

    access_token = create_access_token(
        data={
            "sub": existing_user.email,
            "user_id": existing_user.id
        }
    )

    return {
        "success": True,
        "message": "Login Successful",
        "access_token": access_token,
        "token_type": "Bearer",
        "user": {
            "id": existing_user.id,
            "full_name": existing_user.full_name,
            "email": existing_user.email,
            "phone": existing_user.phone
        }
    }


def get_profile(db: Session, user_id: int):

    user = db.query(User).filter(
        User.id == user_id
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

def update_profile(
    user_id: int,
    user: UpdateProfile,
    db: Session
):

    # Logged-in user
    existing_user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not existing_user:
        return {
            "success": False,
            "message": "User not found"
        }

    # Full Name Validation
    if len(user.full_name.strip()) < 3:
        return {
            "success": False,
            "message": "Full name must be at least 3 characters"
        }

    # Phone Duplicate Check
    existing_phone = db.query(User).filter(
        User.phone == user.phone,
        User.id != user_id
    ).first()

    if existing_phone:
        return {
            "success": False,
            "message": "Phone number already exists"
        }

    # Update User
    existing_user.full_name = user.full_name
    existing_user.phone = user.phone

    db.commit()
    db.refresh(existing_user)

    return {
        "success": True,
        "message": "Profile Updated Successfully",
        "user": {
            "id": existing_user.id,
            "full_name": existing_user.full_name,
            "email": existing_user.email,
            "phone": existing_user.phone
        }
    }

def change_password(
    user_id: int,
    password_data: ChangePassword,
    db: Session
):

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        return {
            "success": False,
            "message": "User not found"
        }

    # Verify current password
    if not verify_password(
        password_data.current_password,
        user.password
    ):
        return {
            "success": False,
            "message": "Current password is incorrect"
        }

    # Password match
    if password_data.new_password != password_data.confirm_password:
        return {
            "success": False,
            "message": "Passwords do not match"
        }

    # Password length
    if len(password_data.new_password) < 8:
        return {
            "success": False,
            "message": "Password must be at least 8 characters"
        }

    # Hash new password
    user.password = hash_password(password_data.new_password)

    db.commit()

    return {
        "success": True,
        "message": "Password Changed Successfully"
    }