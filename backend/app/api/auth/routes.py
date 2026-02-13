from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from .schemas import UserCreate
from .service import create_user
from app.core.email import send_otp_email


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    return create_user(db, user)

from .schemas import UserLogin
from .service import authenticate_user


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    result = authenticate_user(db, user.email, user.password)

    if not result:
        return {"error": "Invalid credentials"}

    return result

import random
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import OTPVerification
from app.core.security import hash_password

@router.post("/send-otp")
def send_otp(data: dict, db: Session = Depends(get_db)):

    otp = str(random.randint(100000, 999999))
    hashed_password = hash_password(data["password"])

    expires = datetime.utcnow() + timedelta(minutes=5)

    otp_entry = OTPVerification(
        email=data["email"],
        first_name=data["first_name"],
        last_name=data["last_name"],
        phone_number=data.get("phone_number"),
        password=hashed_password,
        otp=otp,
        expires_at=expires
    )

    db.add(otp_entry)
    db.commit()

    # 🔥 SEND EMAIL HERE
    send_otp_email(data["email"], otp)

    return {"message": "OTP sent successfully"}

from app.db.models import User

@router.post("/verify-otp")
def verify_otp(data: dict, db: Session = Depends(get_db)):

    print("VERIFY DATA:", data)

    otp_record = db.query(OTPVerification).filter(
        OTPVerification.email == data["email"],
        OTPVerification.otp == data["otp"]
    ).first()

    print("DB RESULT:", otp_record)

    if not otp_record:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    new_user = User(
        first_name=otp_record.first_name,
        last_name=otp_record.last_name,
        email=otp_record.email,
        phone_number=otp_record.phone_number,
        password=otp_record.password
    )

    db.add(new_user)
    db.delete(otp_record)
    db.commit()

    return {"message": "Account created successfully"}
