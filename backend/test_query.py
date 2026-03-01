import sys
import os

sys.path.append("d:/Infosys/hire-helper-auth-ui/HireHelper-Batch2/backend")

from app.db.database import SessionLocal
from app.db.models import Task, User

db = SessionLocal()

tasks = db.query(Task).all()
users = db.query(User).all()

print("USERS:")
for u in users:
    print(f" - {u.id}: {u.email}")

print("\nTASKS:")
for t in tasks:
    print(f" - ID: {t.id} | USER_ID: {t.user_id} | TITLE: {t.title}")

db.close()
