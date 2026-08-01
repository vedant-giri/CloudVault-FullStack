from pydantic import BaseModel

from app.schemas.file import FileResponse


class PaginatedFilesResponse(BaseModel):
    items: list[FileResponse]
    total: int
    page: int
    page_size: int
    pages: int