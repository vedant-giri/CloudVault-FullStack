from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import router
from app.exceptions.handlers import register_exception_handlers

app = FastAPI(
    title="CloudVault API",
    description="A secure file storage API built with FastAPI.",
    version="1.0.0",
)

# CORS Configuration
origins = [
    "http://localhost:5173",                  # Local development
    "https://cloudvault-full-stack.vercel.app",  # Production frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://cloudvault-full-stack.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_exception_handlers(app)


@app.get("/", tags=["Home"])
def root():
    return {
        "project": "CloudVault API",
        "version": "1.0.0",
        "status": "Running",
        "documentation": "/docs",
        "health": "/health",
    }


app.include_router(router)