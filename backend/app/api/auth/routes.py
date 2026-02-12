from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from .schemas import UserCreate
from .service import create_user

router = APIRouter(prefix="/auth", tags=["Auth"])


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

