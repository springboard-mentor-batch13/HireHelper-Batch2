from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone_number: str | None = None
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class RequestOTP(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone_number: str | None = None
    password: str



class VerifyOTP(BaseModel):
    email: EmailStr
    otp: str

class UpdateProfileRequest(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    phone_number: str | None = None
    bio: str | None = None
    profile_picture: str | None = None  # Cloudinary URL

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPassword(BaseModel):
    email: EmailStr
    otp: str
    new_password: str

