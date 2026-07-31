from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

integrations_bp = Blueprint("integrations", __name__, url_prefix="/api/integrations")

@integrations_bp.get("/")
@jwt_required()
def get_integrations():
    return jsonify([
        {
            "name": "Google Drive",
            "status": "In Development",
            "description": "Import documents, sync assets, and search your entire Drive library directly inside Notely.",
            "category": "File Storage"
        },
        {
            "name": "Slack",
            "status": "Planned",
            "description": "Send notifications on note updates, query company knowledge base via slash commands, and clip messages to notes.",
            "category": "Communication"
        },
        {
            "name": "GitHub",
            "status": "Planned",
            "description": "Link issues and pull requests to technical specifications and design docs with live status synchronization.",
            "category": "Developer Tools"
        },
        {
            "name": "Figma",
            "status": "Planned",
            "description": "Embed live canvas previews inside product specs and sync design asset names dynamically.",
            "category": "Design"
        },
        {
            "name": "Notion Import",
            "status": "In Development",
            "description": "Migrate your complete Notion workspace structure, including databases and linked assets, with one click.",
            "category": "Productivity"
        }
    ]), 200
