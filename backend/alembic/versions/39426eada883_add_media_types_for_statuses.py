"""Add media types for statuses

Revision ID: 39426eada883
Revises: 1932e40602af
Create Date: 2025-03-31 20:16:02.885670

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '39426eada883'
down_revision: Union[str, None] = '1932e40602af'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('statuses', sa.Column('media_type_id', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'statuses', 'media_types', ['media_type_id'], ['id'])
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'statuses', type_='foreignkey')
    op.drop_column('statuses', 'media_type_id')
    # ### end Alembic commands ###
