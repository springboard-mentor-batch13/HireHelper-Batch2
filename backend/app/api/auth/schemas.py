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
