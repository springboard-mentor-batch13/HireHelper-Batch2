from sqlalchemy.orm import Session
from app.db.models import Task
import uuid


def create_task(db: Session, task_data, user_id: str):
    task = Task(
        id=str(uuid.uuid4()),
        user_id=user_id,
        title=task_data.title,
        description=task_data.description,
        location=task_data.location,
        start_time=task_data.start_time,
        end_time=task_data.end_time,
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return task
