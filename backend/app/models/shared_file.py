from datetime import datetime

from sqlalchemy import ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class SharedFile(Base):
    __tablename__ = "shared_files"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    file_id: Mapped[int] = mapped_column(
        ForeignKey("files.id", ondelete="CASCADE"),
    )

    owner_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
    )

    shared_with_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )