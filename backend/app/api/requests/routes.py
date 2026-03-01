from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.api.dependencies import get_current_user
from .schemas import RequestCreate, RequestUpdate, RequestResponse
from .service import create_request, get_incoming_requests, get_my_requests, update_request_status

router = APIRouter(prefix="/api/requests", tags=["Requests"])

@router.post("/", response_model=RequestResponse)
def submit_request(
    request_data: RequestCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return create_request(db, current_user.id, request_data)

@router.get("/incoming")
def fetch_incoming_requests(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return get_incoming_requests(db, current_user.id)

@router.get("/my")
def fetch_my_requests(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return get_my_requests(db, current_user.id)

@router.patch("/{request_id}/status", response_model=RequestResponse)
def change_request_status(
    request_id: str,
    update_data: RequestUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return update_request_status(db, current_user.id, request_id, update_data.status)
