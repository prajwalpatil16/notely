"""add_note_embedding

Revision ID: k9j0i1h2g3f4
Revises: j8i9h0g1f2e3
Create Date: 2026-07-31

Creates note_embeddings table: stores a single Gemini text-embedding-004
vector (JSON array of floats) per note for semantic search.
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'k9j0i1h2g3f4'
down_revision = 'j8i9h0g1f2e3'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'note_embeddings',
        sa.Column('id', sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column('note_id', sa.BigInteger(), nullable=False),
        sa.Column('embedding', sa.JSON(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('NOW()')),
        sa.ForeignKeyConstraint(['note_id'], ['notes.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('note_id')
    )


def downgrade():
    op.drop_table('note_embeddings')
