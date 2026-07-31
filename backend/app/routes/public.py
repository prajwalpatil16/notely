from flask import Blueprint, jsonify, abort
from app.models import NoteShare, Note

public_bp = Blueprint("public", __name__, url_prefix="/api/public/notes")

@public_bp.get("/<string:token>")
def get_public_note(token):
    share = NoteShare.query.filter_by(share_token=token, revoked_at=None).first()
    if not share:
        abort(404, description="This share link is invalid or has been revoked.")
        
    note = Note.query.get(share.note_id)
    if not note:
        abort(404, description="Note not found.")
        
    return jsonify({
        "title": note.title,
        "content": note.content or "",
        "created_at": note.created_at.isoformat(),
        "updated_at": note.updated_at.isoformat()
    }), 200
