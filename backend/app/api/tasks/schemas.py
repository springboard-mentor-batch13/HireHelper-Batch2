from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class TaskCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=5)
    location: str = Field(..., min_length=2)
    start_time: datetime
    end_time: Optional[datetime] = None


class TaskResponse(BaseModel):
    id: str
    title: str
    description: str
    location: str
    start_time: datetime
    end_time: Optional[datetime]
    image_url: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True