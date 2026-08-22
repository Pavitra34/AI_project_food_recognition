from sqlalchemy.orm import Session
from app.models.user import User

from app.schemas.user_schema import (
    UserRegister,
    UserLogin,
    UpdateProfile,
    ChangePassword,
    ForgotPasswordRequest,
    ResetPasswordRequest
)

from app.utils.helper import hash_password, verify_password
from app.utils.jwt import create_access_token

import secrets


# =========================================================
# REGISTER
# =========================================================

def register_user(
    user: UserRegister,
    db: Session
):

    # Full Name Validation
    if len(user.full_name.strip()) < 3:
        return {
            "success": False,
            "message": "Full name must be at least 3 characters"
        }

    # Password Match
    if user.password != user.confirm_password:
        return {
            "success": False,
            "message": "Passwords do not match"
        }

    # Password Length
    if len(user.password) < 8:
        return {
            "success": False,
            "message": "Password must be at least 8 characters"
        }

    # Email Duplicate
    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        return {
            "success": False,
            "message": "Email already exists"
        }

    # Phone Duplicate
    existing_phone = db.query(User).filter(
        User.phone == user.phone
    ).first()

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


# =========================================================
# LOGIN
# =========================================================

def login_user(
    user: UserLogin,
    db: Session
):

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


# =========================================================
# GET PROFILE
# =========================================================

def get_profile(
    db: Session,
    user_id: int
):

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


# =========================================================
# UPDATE PROFILE
# =========================================================

def update_profile(
    user_id: int,
    user: UpdateProfile,
    db: Session
):

    existing_user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not existing_user:
        return {
            "success": False,
            "message": "User not found"
        }

    if len(user.full_name.strip()) < 3:
        return {
            "success": False,
            "message": "Full name must be at least 3 characters"
        }

    existing_phone = db.query(User).filter(
        User.phone == user.phone,
        User.id != user_id
    ).first()

    if existing_phone:
        return {
            "success": False,
            "message": "Phone number already exists"
        }

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


# =========================================================
# FORGOT PASSWORD - STEP 1
# =========================================================

def forgot_password(
    email: str,
    db: Session
):

    email = email.strip().lower()

    print("====================================")
    print("FORGOT PASSWORD SERVICE")
    print("Email :", email)
    print("====================================")

    # Find user
    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user:
        return {
            "success": False,
            "message": "No account found with this email"
        }

    # Generate reset token
    reset_token = secrets.token_urlsafe(32)

    # Save token
    user.reset_token = reset_token

    db.commit()
    db.refresh(user)

    print("====================================")
    print("PASSWORD RESET TOKEN")
    print("Email :", email)
    print("Token :", reset_token)
    print("====================================")

    return {
        "success": True,
        "message": "Email verified successfully",
        "email": email,
        "reset_token": reset_token
    }

def reset_password(
    email: str,
    reset_token: str,
    new_password: str,
    confirm_password: str,
    db: Session
):

    email = email.strip().lower()

    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user:
        return {
            "success": False,
            "message": "Email not found"
        }

    # Check reset token
    if not user.reset_token:
        return {
            "success": False,
            "message": "Reset token not found"
        }

    if user.reset_token != reset_token:
        return {
            "success": False,
            "message": "Invalid or expired reset token"
        }

    # Password match
    if new_password != confirm_password:
        return {
            "success": False,
            "message": "Passwords do not match"
        }

    # Password length
    if len(new_password) < 8:
        return {
            "success": False,
            "message": "Password must be at least 8 characters"
        }

    # Prevent same password
    if verify_password(
        new_password,
        user.password
    ):
        return {
            "success": False,
            "message": "New password must be different from current password"
        }

    # Update password
    user.password = hash_password(new_password)

    # Delete used reset token
    user.reset_token = None

    db.commit()
    db.refresh(user)

    return {
        "success": True,
        "message": "Password reset successfully"
    }


# =========================================================
# CHANGE PASSWORD - LOGGED IN USER
# =========================================================

def change_password(
    password_data: ChangePassword,
    db: Session
):

    # Find user by email
    user = db.query(User).filter(
        User.email == password_data.email
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

    # Prevent same password
    if verify_password(
        password_data.new_password,
        user.password
    ):
        return {
            "success": False,
            "message": "New password must be different from current password"
        }

    # Hash new password
    user.password = hash_password(
        password_data.new_password
    )

    db.commit()
    db.refresh(user)

    return {
        "success": True,
        "message": "Password Changed Successfully"
    }

    