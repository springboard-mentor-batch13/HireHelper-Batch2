from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.db.models import TaskRequest, Task, User
from .schemas import RequestCreate, RequestUpdate

def create_request(db: Session, user_id: str, request_data: RequestCreate):
    # Check if task exists
    task = db.query(Task).filter(Task.id == request_data.taskId).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    # Prevent requesting own task
    if task.user_id == user_id:
        raise HTTPException(status_code=400, detail="Cannot request your own task")
        
    # Check if already requested
    existing_req = db.query(TaskRequest).filter(
        TaskRequest.task_id == request_data.taskId,
        TaskRequest.requester_id == user_id
    ).first()
    
    if existing_req:
        raise HTTPException(status_code=400, detail="Already requested this task")
        
    new_request = TaskRequest(
        task_id=request_data.taskId,
        requester_id=user_id,
        message=request_data.message,
        status="pending"
    )
    
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    return new_request

def get_incoming_requests(db: Session, user_id: str):
    # Requests where the user is the TASK OWNER
    requests_query = (
        db.query(
            TaskRequest, 
            Task.title.label("task_title"), 
            Task.description,
            Task.location,
            Task.start_time,
            User.first_name, 
            User.last_name,
            User.profile_picture
        )
        .join(Task, Task.id == TaskRequest.task_id)
        .join(User, User.id == TaskRequest.requester_id)
        .filter(Task.user_id == user_id)
        .order_by(TaskRequest.created_at.desc())
        .all()
    )
    
    result = []
    for req, title, description, location, start_time, f_name, l_name, pic in requests_query:
        req_dict = {
            "id": req.id,
            "task_id": req.task_id,
            "requester_id": req.requester_id,
            "message": req.message,
            "status": req.status,
            "created_at": req.created_at,
            "task_title": title,
            "task_description": description,
            "task_location": location,
            "task_time": start_time,
            "sender_name": f"{f_name} {l_name}".strip(),
            "sender_image": pic,
            "sender_rating": 4.8,
            "sender_reviews": 18
        }
        result.append(req_dict)
        
    return result

def get_my_requests(db: Session, user_id: str):
    # Requests where user is the REQUESTER
    requests_query = (
        db.query(
            TaskRequest, 
            Task.title.label("task_title"), 
            Task.description,
            Task.location,
            Task.start_time,
            User.first_name, 
            User.last_name,
            User.profile_picture
        )
        .join(Task, Task.id == TaskRequest.task_id)
        .join(User, User.id == Task.user_id)
        .filter(TaskRequest.requester_id == user_id)
        .order_by(TaskRequest.created_at.desc())
        .all()
    )
    
    result = []
    for req, title, description, location, start_time, f_name, l_name, pic in requests_query:
        req_dict = {
            "id": req.id,
            "task_id": req.task_id,
            "requester_id": req.requester_id,
            "message": req.message,
            "status": req.status,
            "created_at": req.created_at,
            "task_title": title,
            "task_description": description,
            "task_location": location,
            "task_time": start_time,
            "owner_name": f"{f_name} {l_name}".strip(),
            "owner_image": pic,
            "owner_rating": 4.8,
            "owner_reviews": 18
        }
        result.append(req_dict)
        
    return result

def update_request_status(db: Session, user_id: str, request_id: str, status: str):
    req = db.query(TaskRequest).filter(TaskRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
        
    # Only the task owner can accept/reject
    task = db.query(Task).filter(Task.id == req.task_id).first()
    if task.user_id != user_id:
         raise HTTPException(status_code=403, detail="Not authorized to update this request")
         
    if status not in ["accepted", "rejected", "pending"]:
         raise HTTPException(status_code=400, detail="Invalid status")
    
    req.status = status
    db.commit()
    db.refresh(req)
    return req
