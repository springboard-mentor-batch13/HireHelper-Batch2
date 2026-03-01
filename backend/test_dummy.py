import sys
import os

sys.path.append("d:/Infosys/hire-helper-auth-ui/HireHelper-Batch2/backend")

from app.db.database import SessionLocal
from app.db.models import Task, User
from passlib.context import CryptContext
from datetime import datetime, timedelta

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

db = SessionLocal()

# Check if dummy user exists
dummy_email = "dummy@example.com"
dummy_user = db.query(User).filter(User.email == dummy_email).first()

if not dummy_user:
    print("Creating dummy user...")
    dummy_user = User(
        first_name="Dummy",
        last_name="User",
        email=dummy_email,
        password=pwd_context.hash("password123")
    )
    db.add(dummy_user)
    db.commit()
    db.refresh(dummy_user)

# Check if dummy task exists
dummy_task = db.query(Task).filter(Task.user_id == dummy_user.id).first()
if not dummy_task:
    print("Creating dummy task...")
    dummy_task = Task(
        user_id=dummy_user.id,
        title="Plumbing Help Needed",
        description="I have a leaking pipe under the sink that needs fixing.",
        location="Downtown Area",
        start_time=datetime.utcnow() + timedelta(days=1),
        end_time=datetime.utcnow() + timedelta(days=1, hours=2),
        status="open"
    )
    db.add(dummy_task)
    db.commit()

print("Dummy data ready.")
db.close()
