from pydantic import BaseModel, EmailStr

class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    password: str
    confirm_password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UpdateProfile(BaseModel):
    full_name: str
    phone: str

class ChangePassword(BaseModel):
    email: EmailStr
    current_password: str
    new_password: str
    confirm_password: str

# Forgot Password - Step 1
class ForgotPasswordRequest(BaseModel):

    email: EmailStr


# Forgot Password - Step 2
class ResetPasswordRequest(BaseModel):

    email: EmailStr
    reset_token: str
    new_password: str
    confirm_password: str