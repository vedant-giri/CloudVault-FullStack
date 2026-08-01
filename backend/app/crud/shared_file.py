from sqlalchemy.orm import Session

from app.models.shared_file import SharedFile
from app.models.user import User
from app.models.file import File


def share_file(
    db: Session,
    *,
    file: File,
    owner: User,
    email: str,
):
    # Find recipient
    recipient = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if recipient is None:
        return None, "User not found."

    if recipient.id == owner.id:
        return None, "You cannot share a file with yourself."

    existing = (
        db.query(SharedFile)
        .filter(
            SharedFile.file_id == file.id,
            SharedFile.shared_with_id == recipient.id,
        )
        .first()
    )

    if existing:
        return None, "File already shared with this user."

    shared = SharedFile(
        file_id=file.id,
        owner_id=owner.id,
        shared_with_id=recipient.id,
    )

    db.add(shared)
    db.commit()
    db.refresh(shared)

    return shared, None


def get_shared_files(
    db: Session,
    user_id: int,
):
    return (
        db.query(File)
        .join(
            SharedFile,
            SharedFile.file_id == File.id,
        )
        .filter(
            SharedFile.shared_with_id == user_id,
            File.is_deleted == False,
        )
        .order_by(File.uploaded_at.desc())
        .all()
    )