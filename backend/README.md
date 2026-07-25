# ☁️ CloudVault

A secure cloud file storage backend built with **FastAPI**, **PostgreSQL**, **SQLAlchemy**, and **Docker**. CloudVault provides user authentication, secure file management, search, statistics, and a production-ready REST API.

---

## 🚀 Live Demo

**Backend API**

https://cloudvault-necw.onrender.com

**API Documentation (Swagger UI)**

https://cloudvault-necw.onrender.com/docs

---

## ✨ Features

- 🔐 JWT Authentication
- 👤 User Registration & Login
- 📤 File Upload
- 📥 File Download
- 🗑️ File Delete
- 🔍 File Search
- 📄 Pagination
- 📊 Storage Statistics
- 🗄️ PostgreSQL Database
- 🐳 Docker & Docker Compose
- 🔄 Alembic Database Migrations
- ✅ GitHub Actions CI
- ☁️ Render Deployment
- ⚡ FastAPI Automatic Swagger Documentation

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Backend | FastAPI |
| Language | Python 3.13 |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Authentication | JWT |
| Password Hashing | bcrypt + Passlib |
| Migrations | Alembic |
| Validation | Pydantic |
| Containerization | Docker |
| CI/CD | GitHub Actions |
| Deployment | Render |

---

## 🏗 Architecture

```text
                Client
                   │
                   ▼
          FastAPI REST API
                   │
     ┌─────────────┴─────────────┐
     ▼                           ▼
 Authentication             File Service
     │                           │
     └─────────────┬─────────────┘
                   ▼
            PostgreSQL Database
```

---

## 📁 Project Structure

```text
backend/
│
├── app/
│   ├── api/
│   ├── core/
│   ├── db/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── exceptions/
│   └── main.py
│
├── alembic/
├── tests/
├── Dockerfile
├── docker-compose.yml
├── pyproject.toml
└── README.md
```

---

## ⚙️ Local Installation

Clone the repository

```bash
git clone https://github.com/vedant-giri/CloudVault.git
```

Move into the project

```bash
cd CloudVault/backend
```

Install dependencies

```bash
uv sync
```

Run database migrations

```bash
uv run alembic upgrade head
```

Start the server

```bash
uv run uvicorn app.main:app --reload
```

---

## 🐳 Docker

Build and run

```bash
docker compose up --build
```

---

## 📖 API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /users/register | Register User |
| POST | /users/login | Login |
| GET | /users/me | Current User |
| POST | /files/upload | Upload File |
| GET | /files | List Files |
| GET | /files/search | Search Files |
| GET | /files/download/{id} | Download File |
| DELETE | /files/{id} | Delete File |
| GET | /files/stats | Storage Statistics |
| GET | /health | Health Check |

---

## 📸 Screenshots

Coming soon after the React frontend is completed.

---

## 🔮 Future Improvements

- React Frontend
- Drag & Drop Upload
- Folder Support
- File Sharing
- Email Verification
- Password Reset
- AWS S3 Storage
- Role-Based Access Control
- Redis Caching

---

## 👨‍💻 Author

**Vedant Giri**

GitHub:

https://github.com/vedant-giri

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.