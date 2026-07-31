"""add_user_profile_fields

Revision ID: l0k1j2i3h4g5
Revises: k9j0i1h2g3f4
Create Date: 2026-07-31

Adds extended profile fields to users: bio, location, website, timezone, language.
All nullable — zero migration impact on existing rows.
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'l0k1j2i3h4g5'
down_revision = 'k9j0i1h2g3f4'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('bio', sa.Text(), nullable=True))
        batch_op.add_column(sa.Column('location', sa.String(100), nullable=True))
        batch_op.add_column(sa.Column('website', sa.String(255), nullable=True))
        batch_op.add_column(sa.Column('timezone', sa.String(50), nullable=True, server_default='UTC'))
        batch_op.add_column(sa.Column('language', sa.String(10), nullable=True, server_default='en'))


def downgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('language')
        batch_op.drop_column('timezone')
        batch_op.drop_column('website')
        batch_op.drop_column('location')
        batch_op.drop_column('bio')
