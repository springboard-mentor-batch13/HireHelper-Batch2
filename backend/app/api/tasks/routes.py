from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.api.dependencies import get_current_user
from .schemas import TaskCreate
from .service import create_task

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.post("/")
def add_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return create_task(db, task, current_user.id)
