import math

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
        .filter(
            File.owner_id == owner_id,
            File.is_deleted == False,
        )
        .order_by(File.uploaded_at.desc())
        .all()
    )


def get_recent_files(
    db: Session,
    owner_id: int,
    limit: int = 5,
) -> list[File]:
    return (
        db.query(File)
        .filter(
            File.owner_id == owner_id,
            File.is_deleted == False,
        )
        .order_by(File.uploaded_at.desc())
        .limit(limit)
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


def search_files(
    db: Session,
    owner_id: int,
    search: str,
) -> list[File]:
    return (
        db.query(File)
        .filter(
            File.owner_id == owner_id,
            File.is_deleted == False,
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
):
    query = (
        db.query(File)
        .filter(
            File.owner_id == owner_id,
            File.is_deleted == False,
        )
    )

    total = query.count()

    offset = (page - 1) * page_size

    files = (
        query.order_by(File.uploaded_at.desc())
        .offset(offset)
        .limit(page_size)
        .all()
    )

    pages = math.ceil(total / page_size) if total else 1

    return {
        "items": files,
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": pages,
    }


def get_storage_stats(
    db: Session,
    owner_id: int,
):
    total_files, total_storage = (
        db.query(
            func.count(File.id),
            func.coalesce(func.sum(File.size), 0),
        )
        .filter(
            File.owner_id == owner_id,
            File.is_deleted == False,
        )
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


def move_to_trash(
    db: Session,
    db_file: File,
) -> File:
    db_file.is_deleted = True

    db.commit()
    db.refresh(db_file)

    return db_file


def restore_file(
    db: Session,
    db_file: File,
) -> File:
    db_file.is_deleted = False

    db.commit()
    db.refresh(db_file)

    return db_file


def permanently_delete_file(
    db: Session,
    db_file: File,
) -> None:
    db.delete(db_file)
    db.commit()


def get_deleted_files(
    db: Session,
    owner_id: int,
) -> list[File]:
    return (
        db.query(File)
        .filter(
            File.owner_id == owner_id,
            File.is_deleted == True,
        )
        .order_by(File.uploaded_at.desc())
        .all()
    )


def toggle_favorite(
    db: Session,
    file_id: int,
) -> File | None:
    db_file = (
        db.query(File)
        .filter(File.id == file_id)
        .first()
    )

    if not db_file:
        return None

    db_file.is_favorite = not db_file.is_favorite

    db.commit()
    db.refresh(db_file)

    return db_file


def get_favorite_files(
    db: Session,
    owner_id: int,
) -> list[File]:
    return (
        db.query(File)
        .filter(
            File.owner_id == owner_id,
            File.is_favorite == True,
            File.is_deleted == False,
        )
        .order_by(File.uploaded_at.desc())
        .all()
    )