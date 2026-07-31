"""add_ai_usage_columns

Revision ID: j8i9h0g1f2e3
Revises: i7h8g9f0e1d2
Create Date: 2026-07-31

Adds ai_usage_count and ai_usage_reset_at to users table for per-user
AI quota tracking. Free plan gets 20 AI actions/day (configurable in config.py).
"""
from alembic import op
import sqlalchemy as sa
from datetime import datetime


# revision identifiers, used by Alembic.
revision = 'j8i9h0g1f2e3'
down_revision = 'i7h8g9f0e1d2'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('ai_usage_count', sa.Integer(), nullable=False, server_default='0'))
        batch_op.add_column(sa.Column('ai_usage_reset_at', sa.DateTime(), nullable=False, server_default=sa.text('NOW()')))


def downgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('ai_usage_reset_at')
        batch_op.drop_column('ai_usage_count')
