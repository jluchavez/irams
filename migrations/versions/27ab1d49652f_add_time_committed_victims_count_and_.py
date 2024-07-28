from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '27ab1d49652f'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Add columns with default values
    with op.batch_alter_table('report') as batch_op:
        batch_op.add_column(sa.Column('time_committed', sa.String(length=8), nullable=False, server_default='00:00:00'))
        batch_op.add_column(sa.Column('victims_count', sa.Integer(), nullable=False, server_default='0'))
        batch_op.add_column(sa.Column('vehicle_kind', sa.String(length=100), nullable=False, server_default='Unknown'))

    # Remove the server default to prevent future inserts from using the default
    with op.batch_alter_table('report') as batch_op:
        batch_op.alter_column('time_committed', server_default=None)
        batch_op.alter_column('victims_count', server_default=None)
        batch_op.alter_column('vehicle_kind', server_default=None)

def downgrade():
    # Remove columns
    with op.batch_alter_table('report') as batch_op:
        batch_op.drop_column('time_committed')
        batch_op.drop_column('victims_count')
        batch_op.drop_column('vehicle_kind')
