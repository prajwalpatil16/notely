"""add_fulltext_index

Revision ID: c1b2a3f4e5d6
Revises: a3072dcbe6cd
Create Date: 2026-07-31 05:22:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'c1b2a3f4e5d6'
down_revision = 'a3072dcbe6cd'
branch_labels = None
depends_on = None

def upgrade():
    # Adding FULLTEXT index to notes table on title and content columns.
    op.execute("ALTER TABLE notes ADD FULLTEXT INDEX idx_notes_title_content (title, content)")

def downgrade():
    op.execute("ALTER TABLE notes DROP INDEX idx_notes_title_content")
