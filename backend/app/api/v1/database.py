from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db.dependencies import get_db

router = APIRouter()


@router.get("/db-test", tags=["Database"])
def test_database(db: Session = Depends(get_db)):
    version = db.execute(text("SELECT version();")).scalar()

    return {
        "database": version
    }