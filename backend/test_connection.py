from sqlalchemy import text

from app.db.database import engine

with engine.connect() as connection:
    result = connection.execute(text("SELECT version();"))

    print(result.scalar())