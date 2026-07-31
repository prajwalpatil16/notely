from flask import Blueprint, request, jsonify, abort
from flask_jwt_extended import jwt_required, current_user
from app.models import db, Template, Note

templates_bp = Blueprint("templates", __name__, url_prefix="/api/templates")

@templates_bp.get("/")
@jwt_required()
def get_templates():
    templates = Template.query.filter(
        (Template.owner_id == None) | (Template.owner_id == current_user.id)
    ).order_by(Template.created_at.desc()).all()
    
    return jsonify([{
        "id": t.id,
        "owner_id": t.owner_id,
        "title": t.title,
        "content": t.content or "",
        "category": t.category,
        "created_at": t.created_at.isoformat()
    } for t in templates]), 200

@templates_bp.post("/")
@jwt_required()
def create_template():
    data = request.get_json() or {}
    note_id = data.get("note_id")
    category = data.get("category", "Custom")
    
    if not note_id:
        title = data.get("title")
        content = data.get("content", "")
        if not title:
            abort(400, description="Title or note_id is required.")
    else:
        note = Note.query.filter_by(id=note_id, owner_id=current_user.id).first()
        if not note:
            abort(404, description="Note not found.")
        title = note.title
        content = note.content
        
    template = Template(
        owner_id=current_user.id,
        title=title,
        content=content,
        category=category
    )
    db.session.add(template)
    db.session.commit()
    
    return jsonify({
        "id": template.id,
        "owner_id": template.owner_id,
        "title": template.title,
        "content": template.content or "",
        "category": template.category,
        "created_at": template.created_at.isoformat()
    }), 201

@templates_bp.delete("/<int:template_id>")
@jwt_required()
def delete_template(template_id):
    template = Template.query.filter_by(id=template_id, owner_id=current_user.id).first()
    if not template:
        abort(404, description="Template not found or cannot be deleted.")
        
    db.session.delete(template)
    db.session.commit()
    return "", 204
