from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
from .service import get_feed_tasks
from app.db.database import get_db
from app.api.dependencies import get_current_user
from app.api.tasks.schemas import TaskResponse
from app.api.tasks.service import create_task, get_my_tasks

router = APIRouter(prefix="/tasks", tags=["Tasks"])


# -------------------------
# ADD TASK
# -------------------------
@router.post("/", response_model=TaskResponse)
def add_task(
    title: str = Form(...),
    description: str = Form(...),
    location: str = Form(...),
    start_time: str = Form(...),
    end_time: str = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return create_task(
        db=db,
        user_id=current_user.id,
        title=title,
        description=description,
        location=location,
        start_time=start_time,
        end_time=end_time,
        image=image,
    )


# -------------------------
# MY TASKS
# -------------------------
@router.get("/my", response_model=List[TaskResponse])
def my_tasks(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_my_tasks(db, current_user.id)

@router.get("/feed", response_model=List[TaskResponse])
def task_feed(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_feed_tasks(db, current_user.id)