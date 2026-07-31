"""add_templates

Revision ID: e3d4c5b6a7f8
Revises: d2c3b4a5e6f7
Create Date: 2026-07-31 05:30:00.000000

"""
from alembic import op
import sqlalchemy as sa
from datetime import datetime

# revision identifiers, used by Alembic.
revision = 'e3d4c5b6a7f8'
down_revision = 'd2c3b4a5e6f7'
branch_labels = None
depends_on = None

def upgrade():
    # 1. Create templates table
    templates_table = op.create_table('templates',
        sa.Column('id', sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column('owner_id', sa.BigInteger(), nullable=True),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('content', sa.Text(), nullable=True),
        sa.Column('category', sa.String(length=50), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, default=datetime.utcnow),
        sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # 2. Seed system templates (owner_id = NULL)
    op.bulk_insert(
        templates_table,
        [
            {
                "owner_id": None,
                "title": "REST API Endpoint Reference",
                "category": "API Docs",
                "content": "## Endpoint Description\nDetailed description of what this endpoint does.\n\n### HTTP Request\n`GET /api/v1/resource`\n\n### Headers\n| Name | Type | Required | Description |\n|---|---|---|---|\n| Authorization | String | Yes | Bearer Token |\n\n### Response Body\n```json\n{\n  \"status\": \"success\",\n  \"data\": {}\n}\n```",
                "created_at": datetime.utcnow()
            },
            {
                "owner_id": None,
                "title": "Sprint Planning Template",
                "category": "Sprint Planning",
                "content": "## Sprint Goals\nFocus areas for this iteration.\n\n## Scope / Deliverables\n- [ ] Task 1 (Assignee: @Name)\n- [ ] Task 2 (Assignee: @Name)\n\n## Risks & Dependencies\nList any blockages or risks.",
                "created_at": datetime.utcnow()
            },
            {
                "owner_id": None,
                "title": "Weekly Sync Meeting",
                "category": "Meeting Notes",
                "content": "## Agenda\nQuick overview of topics to discuss.\n\n## Discussion Notes\nDetail what was discussed.\n\n## Action Items\n- [ ] @Name to follow up on X\n- [ ] @Name to investigate Y",
                "created_at": datetime.utcnow()
            },
            {
                "owner_id": None,
                "title": "New Hire Onboarding Checklist",
                "category": "Employee Onboarding",
                "content": "## Welcome to Notely!\nHere is your step-by-step onboarding plan:\n\n### Week 1: Setup & Context\n- [ ] Complete HR enrollment\n- [ ] Setup dev environment / laptop\n- [ ] Read team wiki\n\n### Week 2: First Contribution\n- [ ] Pick a minor bug fix\n- [ ] Submit pull request",
                "created_at": datetime.utcnow()
            },
            {
                "owner_id": None,
                "title": "Candidate Interview Log",
                "category": "Interview Notes",
                "content": "## Candidate Details\n- **Name:** \n- **Role:** \n- **Date:** \n\n## Technical / Problem Solving Ability\nNotes on how they solved the coding challenge.\n\n## Core Values Fit\nCultural alignment observations.\n\n## Recommendation\n[Strong Hire / Hire / No Hire]",
                "created_at": datetime.utcnow()
            },
            {
                "owner_id": None,
                "title": "Lecture Study Guide",
                "category": "Lecture Notes",
                "content": "## Class / Topic\n- **Course:** \n- **Professor:** \n- **Topic:** \n\n## Key Concepts\n- Concept 1\n- Concept 2\n\n## Actionable Review Items\nList questions to practice before exams.",
                "created_at": datetime.utcnow()
            }
        ]
    )

def downgrade():
    op.drop_table('templates')
