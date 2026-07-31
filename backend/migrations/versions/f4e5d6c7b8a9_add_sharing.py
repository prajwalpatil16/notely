"""add_sharing

Revision ID: f4e5d6c7b8a9
Revises: e3d4c5b6a7f8
Create Date: 2026-07-31 05:35:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'f4e5d6c7b8a9'
down_revision = 'e3d4c5b6a7f8'
branch_labels = None
depends_on = None

def upgrade():
    op.create_table('note_shares',
        sa.Column('id', sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column('note_id', sa.BigInteger(), nullable=False),
        sa.Column('owner_id', sa.BigInteger(), nullable=False),
        sa.Column('share_token', sa.String(length=100), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('revoked_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['note_id'], ['notes.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('note_shares', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_note_shares_share_token'), ['share_token'], unique=True)

def downgrade():
    op.drop_table('note_shares')
