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

def get_task(db: Session, task_id: str):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

def update_task(
    db: Session,
    task_id: str,
    user_id: str,
    title: str = None,
    description: str = None,
    location: str = None,
    start_time: str = None,
    end_time: str = None,
    image: UploadFile = None,
):
    task = get_task(db, task_id)
    if task.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this task")

    if title is not None:
        task.title = title
    if description is not None:
        task.description = description
    if location is not None:
        task.location = location

    if start_time is not None:
        try:
            st = start_time.replace("Z", "")
            task.start_time = datetime.fromisoformat(st)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid datetime format")

    if end_time is not None:
        try:
            if end_time.strip():
                et = end_time.replace("Z", "")
                task.end_time = datetime.fromisoformat(et)
            else:
                task.end_time = None
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid datetime format")

    if task.end_time and task.end_time < task.start_time:
        raise HTTPException(
            status_code=400,
            detail="End time cannot be earlier than start time",
        )

    if image and image.filename:
        task.image_url = save_image(image)

    db.commit()
    db.refresh(task)
    return task

def delete_task(db: Session, task_id: str, user_id: str):
    task = get_task(db, task_id)
    if task.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this task")
    
    db.delete(task)
    db.commit()
    return {"message": "Task deleted successfully"}
