from fastapi import (
    APIRouter,
    Depends,
    File,
    UploadFile,
    Query,
    HTTPException,
    status,
)
from app.services.logger import logger
from fastapi.responses import FileResponse as FastAPIFileResponse
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.crud.file import (
    create_file,
    delete_file,
    get_file_by_id,
    get_files_by_owner,
    get_files_paginated,
    get_storage_stats,
    search_files,
)
from app.db.dependencies import get_db
from app.models.user import User
from app.schemas.file import FileResponse
from app.services.file_storage import (
    save_file,
    delete_file_from_disk,
)
from app.services.file_validation import validate_upload

router = APIRouter(
    prefix="/files",
    tags=["Files"],
)


@router.post(
    "/upload",
    response_model=FileResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Validate uploaded file
    await validate_upload(file)

    # Save file to storage
    storage_info = await save_file(file)

    # Save metadata to database
    db_file = create_file(
        db=db,
        filename=file.filename,
        stored_filename=storage_info["stored_filename"],
        filepath=storage_info["filepath"],
        content_type=file.content_type or "application/octet-stream",
        size=storage_info["size"],
        owner_id=current_user.id,
    )

    logger.info(
        f"User {current_user.email} uploaded '{db_file.filename}' ({db_file.size} bytes)"
    )

    return db_file


from typing import Annotated
from fastapi import Query


@router.get(
    "",
    response_model=list[FileResponse],
)
def list_files(
    search: Annotated[str | None, Query()] = None,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if search:
        return search_files(
            db=db,
            owner_id=current_user.id,
            search=search,
        )

    return get_files_paginated(
        db=db,
        owner_id=current_user.id,
        page=page,
        page_size=page_size,
    )

@router.get("/stats")
def file_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_storage_stats(
        db=db,
        owner_id=current_user.id,
    )

@router.get("/{file_id}/download")
def download_file(
    file_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_file = get_file_by_id(db, file_id)

    if db_file is None:
        raise HTTPException(
            status_code=404,
            detail="File not found.",
        )

    if db_file.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to access this file.",
        )

    logger.info(
        f"User {current_user.email} downloaded '{db_file.filename}' ({db_file.size} bytes)"
    )

    return FastAPIFileResponse(
        path=db_file.filepath,
        filename=db_file.filename,
        media_type=db_file.content_type,
    )


@router.delete("/{file_id}")
def remove_file(
    file_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_file = get_file_by_id(db, file_id)

    if db_file is None:
        raise HTTPException(
            status_code=404,
            detail="File not found.",
        )

    if db_file.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to delete this file.",
        )

        # Delete the physical file
    delete_file_from_disk(db_file.filepath)

    # Delete database record
    delete_file(db, db_file)

    logger.info(
        f"User {current_user.email} deleted '{db_file.filename}'"
    )

    return {
        "message": "File deleted successfully."
    }