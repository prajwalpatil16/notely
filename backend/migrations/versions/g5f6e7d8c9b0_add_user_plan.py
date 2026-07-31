"""add_user_plan

Revision ID: g5f6e7d8c9b0
Revises: f4e5d6c7b8a9
Create Date: 2026-07-31 05:40:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'g5f6e7d8c9b0'
down_revision = 'f4e5d6c7b8a9'
branch_labels = None
depends_on = None

def upgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('plan', sa.String(length=20), server_default='free', nullable=False))

def downgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('plan')
