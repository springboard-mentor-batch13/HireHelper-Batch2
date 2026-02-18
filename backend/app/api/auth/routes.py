from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from .schemas import UserCreate, UserLogin, RequestOTP, VerifyOTP, ForgotPasswordRequest, ResetPassword
from .service import create_user, authenticate_user, send_otp_email, verify_otp, send_password_reset_otp, reset_password
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["Auth"])


# -------------------------
# REQUEST OTP
# -------------------------
@router.post("/request-otp")
def request_otp(payload: RequestOTP, db: Session = Depends(get_db)):
    success = send_otp_email(db, payload)

    if not success:
        raise HTTPException(status_code=400, detail="Failed to send OTP")

    return {"message": "OTP sent successfully"}


# -------------------------
# VERIFY OTP
# -------------------------
@router.post("/verify-otp")
def verify_otp_endpoint(payload: VerifyOTP, db: Session = Depends(get_db)):
    is_valid = verify_otp(db, payload.email, payload.otp)

    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid OTP or expired")

    return {"message": "OTP verified successfully"}


# -------------------------
# SIGNUP
# -------------------------
@router.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    return create_user(db, user)


# -------------------------
# LOGIN
# -------------------------
@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    result = authenticate_user(db, user.email, user.password)

    if not result:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return result


# -------------------------
# PASSWORD RESET
# -------------------------
@router.post("/request-password-reset")
def request_password_reset(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    success = send_password_reset_otp(db, payload.email)

    if not success:
        # We generally don't want to expose if email exists or not, but for this specific app requirement:
        raise HTTPException(status_code=400, detail="Email not found or failed to send OTP")

    return {"message": "Password reset OTP sent"}


@router.post("/reset-password")
def reset_password_endpoint(payload: ResetPassword, db: Session = Depends(get_db)):
    result = reset_password(db, payload.email, payload.otp, payload.new_password)

    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    return result
