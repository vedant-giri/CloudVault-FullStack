"""add soft delete

Revision ID: aadf8cc531cf
Revises: bcf48d92325d
Create Date: 2026-08-01 12:44:39.462038

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "aadf8cc531cf"
down_revision: Union[str, Sequence[str], None] = "bcf48d92325d"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.add_column(
        "files",
        sa.Column(
            "is_deleted",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("false"),
        ),
    )

    op.alter_column(
        "files",
        "is_deleted",
        server_default=None,
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_column("files", "is_deleted")