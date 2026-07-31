from flask import Blueprint, request, jsonify, abort
from flask_jwt_extended import jwt_required, current_user
from app.models import db, Note, Tag, Folder, NoteLink, NoteRevision, NoteShare, NoteEmbedding
from app.services.audit_service import log_action
from app.services.embedding_service import embedding_service

notes_bp = Blueprint("notes", __name__, url_prefix="/api/notes")

def _schedule_embed(note_id: int, title: str, content: str):
    """Fire-and-forget: compute + upsert embedding for a note in the background."""
    from app import create_app  # local import avoids circular at module load time
    import threading

    def _run():
        # We need an application context since we're outside a request
        from flask import current_app
        # Build embed text from title + content
        text = f"{title or ''}\n\n{content or ''}".strip()
        vector = embedding_service.embed_text(text)
        if not vector:
            return  # API key missing or call failed — skip silently
        # Use a fresh app context for DB work
        from app.main import app as _app
        with _app.app_context():
            existing = NoteEmbedding.query.filter_by(note_id=note_id).first()
            if existing:
                existing.embedding = vector
            else:
                db.session.add(NoteEmbedding(note_id=note_id, embedding=vector))
            try:
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                print(f"[embedding] upsert failed for note {note_id}: {e}")

    threading.Thread(target=_run, daemon=True).start()


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
    
    has_fulltext = False
    if q:
        if len(q) < 4:
            query = query.filter(Note.title.ilike(f"%{q}%") | Note.content.ilike(f"%{q}%"))
        else:
            query = query.filter(db.text("MATCH(title, content) AGAINST(:q IN NATURAL LANGUAGE MODE)"))
            query = query.params(q=q)
            has_fulltext = True
        
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

    if has_fulltext:
        notes = query.order_by(
            Note.is_pinned.desc(), 
            db.text("MATCH(title, content) AGAINST(:q IN NATURAL LANGUAGE MODE) DESC"), 
            Note.updated_at.desc()
        ).all()
    else:
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
        "version": n.version,
        "share_token": next((s.share_token for s in n.shares if s.revoked_at is None), None),
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

    from app.config import Config
    plan = getattr(current_user, "plan", "free")
    limits = Config.PLAN_LIMITS.get(plan, Config.PLAN_LIMITS["free"])
    
    existing_notes_count = Note.query.filter_by(owner_id=current_user.id).count()
    if existing_notes_count >= limits["max_notes"]:
        return jsonify({"detail": "Note limit reached. Upgrade to Pro for unlimited notes."}), 402

    notes = Note.query.filter_by(owner_id=current_user.id).all()
    total_bytes = sum(len((n.content or "").encode('utf-8')) + len((n.title or "").encode('utf-8')) for n in notes)
    new_note_bytes = len(content.encode('utf-8')) + len(title.encode('utf-8'))
    if (total_bytes + new_note_bytes) > limits["max_storage_bytes"]:
        return jsonify({"detail": "Storage size limit reached. Upgrade to Pro for unlimited notes."}), 402

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

    log_action(current_user.id, "note_create", {"note_id": note.id, "title": note.title})

    # Background: generate embedding for semantic search (non-blocking)
    _schedule_embed(note.id, note.title, note.content)

    return jsonify({
        "id": note.id,
        "title": note.title,
        "content": note.content,
        "is_pinned": note.is_pinned,
        "is_archived": note.is_archived,
        "folder_id": note.folder_id,
        "created_at": note.created_at.isoformat(),
        "updated_at": note.updated_at.isoformat(),
        "version": note.version,
        "share_token": next((s.share_token for s in note.shares if s.revoked_at is None), None),
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
    
    client_version = data.get("version")
    if client_version is not None and client_version < note.version:
        return jsonify({"detail": "This note has been modified by another session. Please reload to edit."}), 409
    
    title_changed = "title" in data and data["title"] != note.title
    content_changed = "content" in data and data["content"] != note.content
    
    if title_changed or content_changed:
        from app.config import Config
        plan = getattr(current_user, "plan", "free")
        limits = Config.PLAN_LIMITS.get(plan, Config.PLAN_LIMITS["free"])
        
        notes = Note.query.filter_by(owner_id=current_user.id).all()
        other_notes_bytes = sum(
            len((n.content or "").encode('utf-8')) + len((n.title or "").encode('utf-8'))
            for n in notes if n.id != note.id
        )
        new_title = data.get("title", note.title)
        new_content = data.get("content", note.content)
        new_note_bytes = len((new_title or "").encode('utf-8')) + len((new_content or "").encode('utf-8'))
        
        if (other_notes_bytes + new_note_bytes) > limits["max_storage_bytes"]:
            return jsonify({"detail": "Storage size limit reached. Upgrade to Pro for unlimited notes."}), 402

        revision = NoteRevision(
            note_id=note.id,
            title=note.title,
            content=note.content
        )
        db.session.add(revision)
        
        existing_revisions = NoteRevision.query.filter_by(note_id=note.id).order_by(NoteRevision.created_at.asc()).all()
        if len(existing_revisions) >= 50:
            to_delete = len(existing_revisions) - 49
            for i in range(to_delete):
                db.session.delete(existing_revisions[i])
    
    has_changes = False
    if "title" in data and data["title"] != note.title:
        note.title = data["title"]
        has_changes = True
    if "content" in data and data["content"] != note.content:
        note.content = data["content"]
        has_changes = True
    if "is_pinned" in data and bool(data["is_pinned"]) != note.is_pinned:
        note.is_pinned = bool(data["is_pinned"])
        has_changes = True
    if "is_archived" in data and bool(data["is_archived"]) != note.is_archived:
        note.is_archived = bool(data["is_archived"])
        has_changes = True
        
    if "folder_id" in data and data["folder_id"] != note.folder_id:
        f_id = data["folder_id"]
        if f_id is not None:
            folder = Folder.query.filter_by(id=f_id, owner_id=current_user.id).first()
            if not folder:
                abort(403, description="Folder does not belong to you.")
        note.folder_id = f_id
        has_changes = True

    if "tag_ids" in data:
        t_ids = data["tag_ids"]
        if t_ids is not None:
            tags = Tag.query.filter(Tag.id.in_(t_ids), Tag.owner_id == current_user.id).all()
            if len(tags) != len(set(t_ids)):
                abort(403, description="One or more tags do not belong to you.")
            
            current_tag_ids = {t.id for t in note.tags}
            new_tag_ids = set(t_ids)
            if current_tag_ids != new_tag_ids:
                note.tags = tags
                has_changes = True

    if has_changes:
        note.version += 1

    db.session.commit()

    log_action(current_user.id, "note_update", {"note_id": note.id, "title": note.title})

    # Background: re-embed if text changed
    if has_changes and ("title" in data or "content" in data):
        _schedule_embed(note.id, note.title, note.content)

    return jsonify({
        "id": note.id,
        "title": note.title,
        "content": note.content,
        "is_pinned": note.is_pinned,
        "is_archived": note.is_archived,
        "folder_id": note.folder_id,
        "created_at": note.created_at.isoformat(),
        "updated_at": note.updated_at.isoformat(),
        "version": note.version,
        "share_token": next((s.share_token for s in note.shares if s.revoked_at is None), None),
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

    log_action(current_user.id, "note_delete", {"note_id": note.id, "title": note.title})
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

@notes_bp.get("/export")
@jwt_required()
def export_notes():
    import io
    import zipfile
    from flask import send_file
    
    fmt = request.args.get("format", "md").lower()
    notes = Note.query.filter_by(owner_id=current_user.id).all()
    
    if fmt == "json":
        import json
        data = [{
            "title": n.title,
            "content": n.content or "",
            "is_pinned": n.is_pinned,
            "is_archived": n.is_archived,
            "created_at": n.created_at.isoformat(),
            "updated_at": n.updated_at.isoformat()
        } for n in notes]
        
        mem = io.BytesIO()
        mem.write(json.dumps(data, indent=2).encode('utf-8'))
        mem.seek(0)
        return send_file(
            mem,
            mimetype="application/json",
            as_attachment=True,
            download_name="notely_export.json"
        )
    else:
        mem = io.BytesIO()
        with zipfile.ZipFile(mem, "w", zipfile.ZIP_DEFLATED) as zf:
            for n in notes:
                safe_title = "".join([c for c in n.title if c.isalnum() or c in (' ', '_', '-')]).strip()
                if not safe_title:
                    safe_title = "Untitled"
                filename = f"{safe_title}.md"
                count = 1
                while filename in zf.namelist():
                    filename = f"{safe_title}_{count}.md"
                    count += 1
                
                md_content = f"# {n.title}\n\n{n.content or ''}"
                zf.writestr(filename, md_content.encode('utf-8'))
        
        mem.seek(0)
        return send_file(
            mem,
            mimetype="application/zip",
            as_attachment=True,
            download_name="notely_export_markdown.zip"
        )

@notes_bp.get("/<int:note_id>/export")
@jwt_required()
def export_single_note(note_id):
    from flask import send_file
    import io
    
    note = Note.query.filter_by(id=note_id, owner_id=current_user.id).first()
    if not note:
        abort(404, description="Note not found.")
        
    fmt = request.args.get("format", "md").lower()
    
    if fmt == "json":
        import json
        data = {
            "title": note.title,
            "content": note.content or "",
            "is_pinned": note.is_pinned,
            "is_archived": note.is_archived,
            "created_at": note.created_at.isoformat(),
            "updated_at": note.updated_at.isoformat()
        }
        mem = io.BytesIO()
        mem.write(json.dumps(data, indent=2).encode('utf-8'))
        mem.seek(0)
        return send_file(
            mem,
            mimetype="application/json",
            as_attachment=True,
            download_name=f"{note.title or 'Untitled'}.json"
        )
    else:
        md_content = f"# {note.title}\n\n{note.content or ''}"
        mem = io.BytesIO()
        mem.write(md_content.encode('utf-8'))
        mem.seek(0)
        return send_file(
            mem,
            mimetype="text/markdown",
            as_attachment=True,
            download_name=f"{note.title or 'Untitled'}.md"
        )

@notes_bp.get("/<int:note_id>/revisions")
@jwt_required()
def get_note_revisions(note_id):
    note = Note.query.filter_by(id=note_id, owner_id=current_user.id).first()
    if not note:
        abort(404, description="Note not found.")
        
    revisions = NoteRevision.query.filter_by(note_id=note_id).order_by(NoteRevision.created_at.desc()).all()
    return jsonify([{
        "id": r.id,
        "note_id": r.note_id,
        "title": r.title,
        "content": r.content,
        "created_at": r.created_at.isoformat()
    } for r in revisions]), 200

@notes_bp.post("/<int:note_id>/revisions/<int:revision_id>/restore")
@jwt_required()
def restore_note_revision(note_id, revision_id):
    note = Note.query.filter_by(id=note_id, owner_id=current_user.id).first()
    if not note:
        abort(404, description="Note not found.")
        
    revision = NoteRevision.query.filter_by(id=revision_id, note_id=note_id).first()
    if not revision:
        abort(404, description="Revision not found.")
        
    new_rev = NoteRevision(
        note_id=note.id,
        title=note.title,
        content=note.content
    )
    db.session.add(new_rev)
    
    existing_revisions = NoteRevision.query.filter_by(note_id=note.id).order_by(NoteRevision.created_at.asc()).all()
    if len(existing_revisions) >= 50:
        to_delete = len(existing_revisions) - 49
        for i in range(to_delete):
            db.session.delete(existing_revisions[i])
            
    note.title = revision.title
    note.content = revision.content
    
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

@notes_bp.post("/<int:note_id>/share")
@jwt_required()
def share_note(note_id):
    import secrets
    note = Note.query.filter_by(id=note_id, owner_id=current_user.id).first()
    if not note:
        abort(404, description="Note not found.")
        
    share = NoteShare.query.filter_by(note_id=note_id, owner_id=current_user.id, revoked_at=None).first()
    if not share:
        share = NoteShare(
            note_id=note_id,
            owner_id=current_user.id,
            share_token=secrets.token_urlsafe(24)
        )
        db.session.add(share)
        db.session.commit()
        
    log_action(current_user.id, "share_create", {"note_id": note.id, "title": note.title})
        
    return jsonify({
        "share_token": share.share_token,
        "created_at": share.created_at.isoformat()
    }), 200

@notes_bp.delete("/<int:note_id>/share")
@jwt_required()
def revoke_note_share(note_id):
    from datetime import datetime
    note = Note.query.filter_by(id=note_id, owner_id=current_user.id).first()
    if not note:
        abort(404, description="Note not found.")
        
    shares = NoteShare.query.filter_by(note_id=note_id, owner_id=current_user.id, revoked_at=None).all()
    for s in shares:
        s.revoked_at = datetime.utcnow()
        
    db.session.commit()
    log_action(current_user.id, "share_revoke", {"note_id": note.id, "title": note.title})
    return jsonify({"message": "Sharing link successfully revoked."}), 200
