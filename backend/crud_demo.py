from app.crud.user import create_user
from app.db.session import SessionLocal
from app.schemas.user import UserCreate

db = SessionLocal()

user = UserCreate(
    full_name="Vedant Giri",
    email="vedant@example.com",
    password="Hello123",
)

created_user = create_user(db, user)

print(created_user.id)
print(created_user.email)
print(created_user.full_name)

db.close()