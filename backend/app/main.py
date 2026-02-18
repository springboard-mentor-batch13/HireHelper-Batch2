from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import engine, Base
from app.db import models
from app.api.auth.routes import router as auth_router
from app.api.tasks.routes import router as task_router
from app.api.dependencies import get_current_user

app = FastAPI(
    title="HireHelper Backend",
    version="1.0.0"
)

# ✅ CORS (THIS FIXES OPTIONS 404)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
Base.metadata.create_all(bind=engine)

# Routers
app.include_router(auth_router)   # /auth/*
app.include_router(task_router)

@app.get("/")
def root():
    return {"message": "HireHelper backend is running"}

@app.get("/me")
def read_current_user(current_user=Depends(get_current_user)):
    return current_user
