from fastapi import FastAPI
from app.db.database import engine, Base
from app.db import models
from app.api.auth.routes import router as auth_router
from app.api.dependencies import get_current_user
from fastapi import FastAPI, Depends
from app.api.tasks.routes import router as task_router


app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(task_router)


@app.get("/")
def root():
    return {"message": "HireHelper backend is running"}


@app.get("/me")
def read_current_user(current_user=Depends(get_current_user)):
    return current_user