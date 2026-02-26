from datetime import datetime
from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.db.models import Task
from app.core.file_upload import save_image


def create_task(
    db: Session,
    user_id: str,
    title: str,
    description: str,
    location: str,
    start_time: str,
    end_time: str,
    image: UploadFile = None,
):
    try:
        # Remove trailing Z if present
        start_time = start_time.replace("Z", "")
        end_time = end_time.replace("Z", "") if end_time else None

        start_time = datetime.fromisoformat(start_time)
        end_time = datetime.fromisoformat(end_time) if end_time else None

    except Exception:
        raise HTTPException(status_code=400, detail="Invalid datetime format")

    if end_time and end_time < start_time:
        raise HTTPException(
            status_code=400,
            detail="End time cannot be earlier than start time",
        )

    image_url = None
    if image:
        image_url = save_image(image)

    new_task = Task(
        user_id=user_id,
        title=title,
        description=description,
        location=location,
        start_time=start_time,
        end_time=end_time,
        image_url=image_url,
        status="open",
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task


def get_my_tasks(db: Session, user_id: str):
    return (
        db.query(Task)
        .filter(Task.user_id == user_id)
        .order_by(Task.created_at.desc())
        .all()
    )
def get_feed_tasks(db: Session, user_id: str):
    return (
        db.query(Task)
        .filter(Task.user_id != user_id)
        .filter(Task.status == "open")
        .order_by(Task.created_at.desc())
        .all()
    )