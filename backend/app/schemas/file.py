from datetime import datetime

from pydantic import BaseModel, ConfigDict


class FileResponse(BaseModel):
    id: int
    filename: str
    content_type: str
    size: int
    uploaded_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )