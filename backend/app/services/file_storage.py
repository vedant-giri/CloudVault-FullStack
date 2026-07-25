from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile

STORAGE_DIR = Path("storage")
STORAGE_DIR.mkdir(exist_ok=True)


async def save_file(file: UploadFile) -> dict:
    extension = Path(file.filename).suffix
    unique_filename = f"{uuid4()}{extension}"

    file_path = STORAGE_DIR / unique_filename

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    return {
        "stored_filename": unique_filename,
        "filepath": str(file_path),
        "size": file_path.stat().st_size,
    }


def delete_file_from_disk(filepath: str) -> None:
    file_path = Path(filepath)

    if file_path.exists():
        file_path.unlink()