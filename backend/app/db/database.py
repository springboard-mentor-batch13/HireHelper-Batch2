from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Decide DB type
if DATABASE_URL and DATABASE_URL.startswith("sqlite"):
    print("⚠️ Using SQLite database")
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )

elif DATABASE_URL:
    print("✅ Using PostgreSQL (shared team database)")
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True
    )

else:
    print("⚠️ DATABASE_URL not found. Falling back to SQLite.")
    engine = create_engine(
        "sqlite:///./local.db",
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False
)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
