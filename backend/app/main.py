from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import engine, Base
from app.db import models
from app.api.auth.routes import router as auth_router
from app.api.tasks.routes import router as task_router
from app.api.dependencies import get_current_user


# 1️⃣ First create app
app = FastAPI()


# 2️⃣ Then add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 3️⃣ Then create tables
Base.metadata.create_all(bind=engine)


# 4️⃣ Then include routers
app.include_router(auth_router)
app.include_router(task_router)


# 5️⃣ Routes
@app.get("/")
def root():
    return {"message": "HireHelper backend is running"}


@app.get("/me")
def read_current_user(current_user=Depends(get_current_user)):
    return current_user
