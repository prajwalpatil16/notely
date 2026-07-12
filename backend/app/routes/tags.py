from flask import Blueprint, request, jsonify, abort
from flask_jwt_extended import jwt_required, current_user
from app.models import db, Tag, Note

tags_bp = Blueprint("tags", __name__, url_prefix="/api/tags")

@tags_bp.get("/")
@jwt_required()
def get_tags():
    tags = Tag.query.filter_by(owner_id=current_user.id).all()
    return jsonify([{
        "id": t.id,
        "name": t.name,
        "color": t.color,
        "owner_id": t.owner_id
    } for t in tags]), 200

@tags_bp.post("/")
@jwt_required()
def create_tag():
    data = request.get_json() or {}
    name = data.get("name")
    color = data.get("color", "#E85D30")
    if not name:
        return jsonify({"detail": "Tag name is required."}), 400

    tag = Tag(name=name, color=color, owner_id=current_user.id)
    db.session.add(tag)
    db.session.commit()

    return jsonify({
        "id": tag.id,
        "name": tag.name,
        "color": tag.color,
        "owner_id": tag.owner_id
    }), 201

@tags_bp.delete("/<int:tag_id>")
@jwt_required()
def delete_tag(tag_id):
    tag = Tag.query.filter_by(id=tag_id, owner_id=current_user.id).first()
    if not tag:
        abort(404, description="Tag not found.")

    db.session.delete(tag)
    db.session.commit()
    return "", 204

@tags_bp.post("/notes/<int:note_id>")
@jwt_required()
def attach_tags_to_note(note_id):
    note = Note.query.filter_by(id=note_id, owner_id=current_user.id).first()
    if not note:
        abort(404, description="Note not found.")

    data = request.get_json() or {}
    tag_ids = data.get("tag_ids")
    tag_names = data.get("tags") # list of tag names e.g. ["AI", "Note"]

    associated_tags = []

    if tag_ids is not None:
        if tag_ids:
            tags = Tag.query.filter(Tag.id.in_(tag_ids), Tag.owner_id == current_user.id).all()
            if len(tags) != len(set(tag_ids)):
                abort(403, description="One or more tags do not belong to you.")
            associated_tags.extend(tags)

    if tag_names is not None:
        for name in tag_names:
            name = name.strip()
            if not name:
                continue
            tag = Tag.query.filter_by(name=name, owner_id=current_user.id).first()
            if not tag:
                tag = Tag(name=name, owner_id=current_user.id)
                db.session.add(tag)
            associated_tags.append(tag)

    if tag_ids is not None or tag_names is not None:
        note.tags = list(set(associated_tags))
        db.session.commit()

    return jsonify({
        "id": note.id,
        "tags": [{
            "id": t.id,
            "name": t.name,
            "color": t.color
        } for t in note.tags]
    }), 200
