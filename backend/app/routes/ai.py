from flask import Blueprint, request, jsonify, abort
from flask_jwt_extended import jwt_required, current_user
from app.models import db, ChatSession, ChatMessage, Note, NoteLink
from app.services.ai_service import ai_service
from app import limiter

ai_bp = Blueprint("ai", __name__, url_prefix="/api/ai")

@ai_bp.post("/summarize")
@jwt_required()
@limiter.limit("20 per hour")
def summarize():
    data = request.get_json() or {}
    content = data.get("content")
    if not content:
        return jsonify({"detail": "Content is required."}), 400

    summary = ai_service.summarize_note(content)
    return jsonify({"summary": summary}), 200

@ai_bp.post("/suggest-tags")
@jwt_required()
@limiter.limit("20 per hour")
def suggest_tags():
    data = request.get_json() or {}
    content = data.get("content")
    if not content:
        return jsonify({"detail": "Content is required."}), 400

    tags = ai_service.suggest_tags(content)
    return jsonify({"tags": tags}), 200

@ai_bp.post("/improve")
@jwt_required()
@limiter.limit("20 per hour")
def improve():
    data = request.get_json() or {}
    content = data.get("content")
    if not content:
        return jsonify({"detail": "Content is required."}), 400

    improved_content = ai_service.improve_content(content)
    return jsonify({"content": improved_content}), 200

@ai_bp.post("/chat")
@jwt_required()
@limiter.limit("30 per hour")
def chat():
    data = request.get_json() or {}
    message = data.get("message")
    session_id = data.get("chat_session_id")

    if not message:
        return jsonify({"detail": "Message is required."}), 400

    session = None
    if session_id:
        session = ChatSession.query.filter_by(id=session_id, owner_id=current_user.id).first()
        if not session:
            return jsonify({"detail": "Chat session not found."}), 404
    else:
        title = message[:40] + ("..." if len(message) > 40 else "")
        session = ChatSession(owner_id=current_user.id, title=title)
        db.session.add(session)
        db.session.commit()

    # Load history context
    msgs = ChatMessage.query.filter_by(session_id=session.id).order_by(ChatMessage.created_at.asc()).all()
    history = [{"role": m.role, "content": m.content} for m in msgs]

    # Generate response via the background thread service
    response_text, cited_note_ids = ai_service.generate_chat_response(current_user.id, message, history)

    # Save to DB
    user_msg = ChatMessage(session_id=session.id, role="user", content=message)
    assistant_msg = ChatMessage(
        session_id=session.id,
        role="assistant",
        content=response_text,
        cited_note_ids=cited_note_ids
    )

    db.session.add(user_msg)
    db.session.add(assistant_msg)
    db.session.commit()

    # Load citations details for frontend consumption
    citations = []
    if cited_note_ids:
        notes = Note.query.filter(Note.id.in_(cited_note_ids), Note.owner_id == current_user.id).all()
        citations = [{"id": n.id, "title": n.title} for n in notes]

    return jsonify({
        "chat_session_id": session.id,
        "response": response_text,
        "cited_note_ids": cited_note_ids,
        "citations": citations
    }), 200

@ai_bp.get("/related/<int:note_id>")
@jwt_required()
@limiter.limit("20 per hour")
def get_related_notes(note_id):
    note = Note.query.filter_by(id=note_id, owner_id=current_user.id).first()
    if not note:
        abort(404, description="Note not found.")

    suggestions = ai_service.suggest_related_notes(current_user.id, note_id)
    return jsonify({"suggestions": suggestions}), 200

@ai_bp.get("/sessions")
@jwt_required()
def get_chat_sessions():
    sessions = ChatSession.query.filter_by(owner_id=current_user.id).order_by(ChatSession.updated_at.desc()).all()
    return jsonify([{
        "id": s.id,
        "title": s.title,
        "created_at": s.created_at.isoformat(),
        "updated_at": s.updated_at.isoformat()
    } for s in sessions]), 200

@ai_bp.get("/sessions/<int:session_id>/messages")
@jwt_required()
def get_session_messages(session_id):
    session = ChatSession.query.filter_by(id=session_id, owner_id=current_user.id).first()
    if not session:
        abort(404, description="Chat session not found.")

    messages = ChatMessage.query.filter_by(session_id=session.id).order_by(ChatMessage.created_at.asc()).all()
    
    response_list = []
    for m in messages:
        citations = []
        if m.cited_note_ids:
            notes = Note.query.filter(Note.id.in_(m.cited_note_ids), Note.owner_id == current_user.id).all()
            citations = [{"id": n.id, "title": n.title} for n in notes]
            
        response_list.append({
            "id": m.id,
            "role": m.role,
            "content": m.content,
            "cited_note_ids": m.cited_note_ids,
            "citations": citations,
            "created_at": m.created_at.isoformat()
        })
        
    return jsonify(response_list), 200
