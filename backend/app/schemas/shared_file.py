from pydantic import BaseModel, EmailStr


class ShareFileRequest(BaseModel):
    email: EmailStr