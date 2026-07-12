from flask import Blueprint, request, jsonify, abort
from flask_jwt_extended import jwt_required, current_user
from app.models import db, Note, Tag, Folder, NoteLink

notes_bp = Blueprint("notes", __name__, url_prefix="/api/notes")

@notes_bp.get("/")
@jwt_required()
def get_notes():
    q = request.args.get("q")
    folder_id = request.args.get("folder_id")
    tag_id = request.args.get("tag_id")
    
    # Check archived flag, default to false if not specified
    archived = request.args.get("archived", "false").lower() == "true"
    pinned = request.args.get("pinned")
    
    query = Note.query.filter_by(owner_id=current_user.id, is_archived=archived)
    
    if q:
        query = query.filter(Note.title.ilike(f"%{q}%") | Note.content.ilike(f"%{q}%"))
        
    if folder_id:
        try:
            folder_id_int = int(folder_id)
            query = query.filter_by(folder_id=folder_id_int)
        except ValueError:
            pass
            
    if tag_id:
        try:
            tag_id_int = int(tag_id)
            query = query.filter(Note.tags.any(Tag.id == tag_id_int))
        except ValueError:
            pass

    if pinned is not None:
        pinned_bool = pinned.lower() == "true"
        query = query.filter_by(is_pinned=pinned_bool)

    notes = query.order_by(Note.is_pinned.desc(), Note.updated_at.desc()).all()
    
    return jsonify([{
        "id": n.id,
        "title": n.title,
        "content": n.content,
        "is_pinned": n.is_pinned,
        "is_archived": n.is_archived,
        "folder_id": n.folder_id,
        "created_at": n.created_at.isoformat(),
        "updated_at": n.updated_at.isoformat(),
        "tags": [{
            "id": t.id,
            "name": t.name,
            "color": t.color
        } for t in n.tags]
    } for n in notes]), 200

@notes_bp.post("/")
@jwt_required()
def create_note():
    data = request.get_json() or {}
    title = data.get("title", "Untitled")
    content = data.get("content", "")
    folder_id = data.get("folder_id")
    tag_ids = data.get("tag_ids")

    # IDOR Validation on folder_id
    if folder_id is not None:
        folder = Folder.query.filter_by(id=folder_id, owner_id=current_user.id).first()
        if not folder:
            abort(403, description="Folder does not belong to you.")

    # IDOR Validation on tag_ids
    tags = []
    if tag_ids:
        tags = Tag.query.filter(Tag.id.in_(tag_ids), Tag.owner_id == current_user.id).all()
        if len(tags) != len(set(tag_ids)):
            abort(403, description="One or more tags do not belong to you.")

    note = Note(
        title=title,
        content=content,
        folder_id=folder_id,
        owner_id=current_user.id,
        tags=tags
    )
    db.session.add(note)
    db.session.commit()

    return jsonify({
        "id": note.id,
        "title": note.title,
        "content": note.content,
        "is_pinned": note.is_pinned,
        "is_archived": note.is_archived,
        "folder_id": note.folder_id,
        "created_at": note.created_at.isoformat(),
        "updated_at": note.updated_at.isoformat(),
        "tags": [{
            "id": t.id,
            "name": t.name,
            "color": t.color
        } for t in note.tags]
    }), 201

@notes_bp.put("/<int:note_id>")
@jwt_required()
def update_note(note_id):
    note = Note.query.filter_by(id=note_id, owner_id=current_user.id).first()
    if not note:
        abort(404, description="Note not found.")

    data = request.get_json() or {}
    
    if "title" in data:
        note.title = data["title"]
    if "content" in data:
        note.content = data["content"]
    if "is_pinned" in data:
        note.is_pinned = bool(data["is_pinned"])
    if "is_archived" in data:
        note.is_archived = bool(data["is_archived"])
        
    if "folder_id" in data:
        f_id = data["folder_id"]
        if f_id is not None:
            folder = Folder.query.filter_by(id=f_id, owner_id=current_user.id).first()
            if not folder:
                abort(403, description="Folder does not belong to you.")
        note.folder_id = f_id

    if "tag_ids" in data:
        t_ids = data["tag_ids"]
        if t_ids is not None:
            tags = Tag.query.filter(Tag.id.in_(t_ids), Tag.owner_id == current_user.id).all()
            if len(tags) != len(set(t_ids)):
                abort(403, description="One or more tags do not belong to you.")
            note.tags = tags

    db.session.commit()

    return jsonify({
        "id": note.id,
        "title": note.title,
        "content": note.content,
        "is_pinned": note.is_pinned,
        "is_archived": note.is_archived,
        "folder_id": note.folder_id,
        "created_at": note.created_at.isoformat(),
        "updated_at": note.updated_at.isoformat(),
        "tags": [{
            "id": t.id,
            "name": t.name,
            "color": t.color
        } for t in note.tags]
    }), 200

@notes_bp.delete("/<int:note_id>")
@jwt_required()
def delete_note(note_id):
    note = Note.query.filter_by(id=note_id, owner_id=current_user.id).first()
    if not note:
        abort(404, description="Note not found.")

    db.session.delete(note)
    db.session.commit()
    return "", 204

@notes_bp.patch("/<int:note_id>/pin")
@jwt_required()
def toggle_pin_note(note_id):
    note = Note.query.filter_by(id=note_id, owner_id=current_user.id).first()
    if not note:
        abort(404, description="Note not found.")

    note.is_pinned = not note.is_pinned
    db.session.commit()

    return jsonify({
        "id": note.id,
        "is_pinned": note.is_pinned
    }), 200

@notes_bp.patch("/<int:note_id>/archive")
@jwt_required()
def toggle_archive_note(note_id):
    note = Note.query.filter_by(id=note_id, owner_id=current_user.id).first()
    if not note:
        abort(404, description="Note not found.")

    note.is_archived = not note.is_archived
    db.session.commit()

    return jsonify({
        "id": note.id,
        "is_archived": note.is_archived
    }), 200

@notes_bp.get("/links")
@jwt_required()
def get_note_links():
    links = NoteLink.query.filter_by(owner_id=current_user.id).all()
    return jsonify([{
        "id": l.id,
        "source_note_id": l.source_note_id,
        "target_note_id": l.target_note_id,
        "relation_type": l.relation_type,
        "created_at": l.created_at.isoformat()
    } for l in links]), 200

@notes_bp.post("/links")
@jwt_required()
def create_note_link():
    data = request.get_json() or {}
    source_id = data.get("source_note_id")
    target_id = data.get("target_note_id")
    relation_type = data.get("relation_type", "manual")

    if not source_id or not target_id:
        return jsonify({"detail": "source_note_id and target_note_id are required."}), 400

    # Verify both notes belong to user (IDOR prevention)
    source_note = Note.query.filter_by(id=source_id, owner_id=current_user.id).first()
    target_note = Note.query.filter_by(id=target_id, owner_id=current_user.id).first()

    if not source_note or not target_note:
        abort(403, description="One or both notes do not belong to you.")

    # Prevent duplication
    existing = NoteLink.query.filter(
        ((NoteLink.source_note_id == source_id) & (NoteLink.target_note_id == target_id)) |
        ((NoteLink.source_note_id == target_id) & (NoteLink.target_note_id == source_id))
    ).first()
    
    if existing:
        return jsonify({
            "id": existing.id,
            "source_note_id": existing.source_note_id,
            "target_note_id": existing.target_note_id,
            "relation_type": existing.relation_type
        }), 200

    link = NoteLink(
        source_note_id=source_id,
        target_note_id=target_id,
        relation_type=relation_type,
        owner_id=current_user.id
    )
    db.session.add(link)
    db.session.commit()

    return jsonify({
        "id": link.id,
        "source_note_id": link.source_note_id,
        "target_note_id": link.target_note_id,
        "relation_type": link.relation_type
    }), 201

@notes_bp.delete("/links/<int:link_id>")
@jwt_required()
def delete_note_link(link_id):
    link = NoteLink.query.filter_by(id=link_id, owner_id=current_user.id).first()
    if not link:
        abort(404, description="Note link not found.")
    db.session.delete(link)
    db.session.commit()
    return "", 204
