from sqlalchemy import create_engine

from app.core.config import settings
from app.db.base import Base

engine = create_engine(
    settings.DATABASE_URL,
    echo=True,
)