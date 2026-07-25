from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.file import File


def create_file(
    db: Session,
    *,
    filename: str,
    stored_filename: str,
    filepath: str,
    content_type: str,
    size: int,
    owner_id: int,
) -> File:
    db_file = File(
        filename=filename,
        stored_filename=stored_filename,
        filepath=filepath,
        content_type=content_type,
        size=size,
        owner_id=owner_id,
    )

    db.add(db_file)
    db.commit()
    db.refresh(db_file)

    return db_file


def get_files_by_owner(
    db: Session,
    owner_id: int,
) -> list[File]:
    return (
        db.query(File)
        .filter(File.owner_id == owner_id)
        .order_by(File.uploaded_at.desc())
        .all()
    )


def get_file_by_id(
    db: Session,
    file_id: int,
) -> File | None:
    return (
        db.query(File)
        .filter(File.id == file_id)
        .first()
    )


def delete_file(
    db: Session,
    db_file: File,
) -> None:
    db.delete(db_file)
    db.commit()


def search_files(
    db: Session,
    owner_id: int,
    search: str,
) -> list[File]:
    return (
        db.query(File)
        .filter(
            File.owner_id == owner_id,
            File.filename.ilike(f"%{search}%"),
        )
        .order_by(File.uploaded_at.desc())
        .all()
    )

def get_files_paginated(
    db: Session,
    owner_id: int,
    page: int,
    page_size: int,
) -> list[File]:
    offset = (page - 1) * page_size

    return (
        db.query(File)
        .filter(File.owner_id == owner_id)
        .order_by(File.uploaded_at.desc())
        .offset(offset)
        .limit(page_size)
        .all()
    )

def get_storage_stats(
    db: Session,
    owner_id: int,
):
    total_files, total_storage = (
        db.query(
            func.count(File.id),
            func.coalesce(func.sum(File.size), 0),
        )
        .filter(File.owner_id == owner_id)
        .one()
    )

    average_size = (
        total_storage // total_files
        if total_files
        else 0
    )

    return {
        "total_files": total_files,
        "total_storage_bytes": total_storage,
        "average_file_size": average_size,
    }