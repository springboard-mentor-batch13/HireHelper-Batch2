from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class RequestCreate(BaseModel):
    taskId: str
    message: Optional[str] = None
        
class RequestUpdate(BaseModel):
    status: str

class RequestResponse(BaseModel):
    id: str
    task_id: str
    requester_id: str
    message: Optional[str] = None
    status: str
    created_at: datetime
    
    # Extra display fields
    task_title: Optional[str] = None
    task_description: Optional[str] = None
    task_location: Optional[str] = None
    task_time: Optional[datetime] = None
    
    sender_name: Optional[str] = None
    sender_image: Optional[str] = None
    sender_rating: Optional[float] = 4.8
    sender_reviews: Optional[int] = 18

    owner_name: Optional[str] = None
    owner_image: Optional[str] = None
    owner_rating: Optional[float] = 4.8
    owner_reviews: Optional[int] = 18

    class Config:
        from_attributes = True
