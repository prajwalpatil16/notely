"""add_note_version

Revision ID: i7h8g9f0e1d2
Revises: h6g7f8e9d0c1
Create Date: 2026-07-31 05:50:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'i7h8g9f0e1d2'
down_revision = 'h6g7f8e9d0c1'
branch_labels = None
depends_on = None

def upgrade():
    with op.batch_alter_table('notes', schema=None) as batch_op:
        batch_op.add_column(sa.Column('version', sa.Integer(), server_default='1', nullable=False))

def downgrade():
    with op.batch_alter_table('notes', schema=None) as batch_op:
        batch_op.drop_column('version')
