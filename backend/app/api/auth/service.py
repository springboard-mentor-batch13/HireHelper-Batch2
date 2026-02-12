from sqlalchemy.orm import Session
from app.db.models import User
from app.core.security import hash_password


def create_user(db: Session, user_data):
    hashed_password = hash_password(user_data.password)

    user = User(
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        email=user_data.email,
        phone_number=user_data.phone_number,
        password=hashed_password,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

from app.core.security import verify_password, create_access_token


def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        return None

    if not verify_password(password, user.password):
        return None

    token = create_access_token({"sub": user.email})

    return {"access_token": token, "token_type": "bearer"}
