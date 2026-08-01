from datetime import datetime

from pydantic import BaseModel, ConfigDict


class FileResponse(BaseModel):
    id: int
    filename: str
    content_type: str
    size: int
    uploaded_at: datetime
    is_favorite: bool

    model_config = ConfigDict(
        from_attributes=True
    )