"""add_note_revision

Revision ID: d2c3b4a5e6f7
Revises: c1b2a3f4e5d6
Create Date: 2026-07-31 05:25:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'd2c3b4a5e6f7'
down_revision = 'c1b2a3f4e5d6'
branch_labels = None
depends_on = None

def upgrade():
    op.create_table('note_revisions',
        sa.Column('id', sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column('note_id', sa.BigInteger(), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('content', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['note_id'], ['notes.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade():
    op.drop_table('note_revisions')
