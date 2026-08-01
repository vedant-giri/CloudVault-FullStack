from fastapi import (
    APIRouter,
    Depends,
    File,
    UploadFile,
    Query,
    HTTPException,
    status,
)
from typing import Annotated
from app.schemas.pagination import PaginatedFilesResponse
from app.services.logger import logger
from fastapi.responses import FileResponse as FastAPIFileResponse
from sqlalchemy.orm import Session
from app.api.dependencies import get_current_user
from app.crud.file import (
    create_file,
    get_file_by_id,
    get_files_by_owner,
    get_files_paginated,
    get_storage_stats,
    search_files,
    get_recent_files,
    toggle_favorite,
    get_favorite_files,
    move_to_trash,
    restore_file,
    permanently_delete_file,
    get_deleted_files,
)
from app.db.dependencies import get_db
from app.models.user import User
from app.schemas.file import FileResponse
from app.services.file_storage import (
    save_file,
    delete_file_from_disk,
)
from app.services.file_validation import validate_upload
from app.schemas.shared_file import ShareFileRequest
from app.crud.shared_file import (
    share_file,
    get_shared_files,
)


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




@router.get(
    "",
    response_model=PaginatedFilesResponse,
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

@router.get(
    "/recent",
    response_model=list[FileResponse],
)
def recent_files(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_recent_files(
        db=db,
        owner_id=current_user.id,
    )

@router.get(
    "/favorites",
    response_model=list[FileResponse],
)
def favorite_files(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_favorite_files(
        db=db,
        owner_id=current_user.id,
    )

@router.post("/{file_id}/share")
def share_existing_file(
    file_id: int,
    request: ShareFileRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_file = get_file_by_id(
        db=db,
        file_id=file_id,
    )

    if db_file is None:
        raise HTTPException(
            status_code=404,
            detail="File not found.",
        )

    if db_file.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You do not own this file.",
        )

    shared, error = share_file(
        db=db,
        file=db_file,
        owner=current_user,
        email=request.email,
    )

    if error:
        raise HTTPException(
            status_code=400,
            detail=error,
        )

    return {
        "message": "File shared successfully."
    }

@router.get(
    "/shared",
    response_model=list[FileResponse],
)
def shared_files(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_shared_files(
        db=db,
        user_id=current_user.id,
    )


@router.get(
    "/trash",
    response_model=list[FileResponse],
)
def trash_files(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_deleted_files(
        db=db,
        owner_id=current_user.id,
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


@router.get("/{file_id}/preview")
def preview_file(
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

    return FastAPIFileResponse(
        path=db_file.filepath,
        media_type=db_file.content_type,
        headers={
            "Content-Disposition": "inline"
        },
    )

@router.patch(
    "/{file_id}/favorite",
    response_model=FileResponse,
)
def favorite_file(
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
            detail="You do not have permission.",
        )

    return toggle_favorite(
        db=db,
        file_id=file_id,
    )

@router.patch("/{file_id}/restore")
def restore_deleted_file(
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
            detail="Access denied.",
        )

    return restore_file(
        db=db,
        db_file=db_file,
    )


@router.delete("/{file_id}/permanent")
def permanent_delete(
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
            detail="Access denied.",
        )

    delete_file_from_disk(db_file.filepath)

    permanently_delete_file(
        db=db,
        db_file=db_file,
    )

    logger.info(
        f"User {current_user.email} permanently deleted '{db_file.filename}'"
    )

    return {
        "message": "File permanently deleted."
    }


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

    move_to_trash(
        db=db,
        db_file=db_file,
    )

    logger.info(
        f"User {current_user.email} moved '{db_file.filename}' to trash"
    )

    return {
        "message": "File moved to trash."
    }