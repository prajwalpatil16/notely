from flask import Blueprint, request, jsonify, abort
from flask_jwt_extended import jwt_required, current_user
from app.models import db, ChatSession, ChatMessage, Note, NoteLink, NoteEmbedding
from app.services.ai_service import ai_service
from app.services.embedding_service import embedding_service
from app.services.quota_service import require_ai_quota
from app import limiter

ai_bp = Blueprint("ai", __name__, url_prefix="/api/ai")

# ─── Existing: Summarize ──────────────────────────────────────────────────────

@ai_bp.post("/summarize")
@jwt_required()
@limiter.limit("20 per hour")
@require_ai_quota
def summarize():
    data = request.get_json() or {}
    content = data.get("content")
    if not content:
        return jsonify({"detail": "Content is required."}), 400

    summary = ai_service.summarize_note(content)
    return jsonify({"summary": summary}), 200

# ─── Existing: Suggest Tags ───────────────────────────────────────────────────

@ai_bp.post("/suggest-tags")
@jwt_required()
@limiter.limit("20 per hour")
@require_ai_quota
def suggest_tags():
    data = request.get_json() or {}
    content = data.get("content")
    if not content:
        return jsonify({"detail": "Content is required."}), 400

    tags = ai_service.suggest_tags(content)
    return jsonify({"tags": tags}), 200

# ─── Existing: Improve ────────────────────────────────────────────────────────

@ai_bp.post("/improve")
@jwt_required()
@limiter.limit("20 per hour")
@require_ai_quota
def improve():
    data = request.get_json() or {}
    content = data.get("content")
    if not content:
        return jsonify({"detail": "Content is required."}), 400

    improved_content = ai_service.improve_content(content)
    return jsonify({"content": improved_content}), 200

# ─── Existing: Chat ───────────────────────────────────────────────────────────

@ai_bp.post("/chat")
@jwt_required()
@limiter.limit("30 per hour")
@require_ai_quota
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

# ─── Existing: Related Notes ──────────────────────────────────────────────────

@ai_bp.get("/related/<int:note_id>")
@jwt_required()
@limiter.limit("20 per hour")
@require_ai_quota
def get_related_notes(note_id):
    note = Note.query.filter_by(id=note_id, owner_id=current_user.id).first()
    if not note:
        abort(404, description="Note not found.")

    suggestions = ai_service.suggest_related_notes(current_user.id, note_id)
    return jsonify({"suggestions": suggestions}), 200

# ─── Existing: Chat Sessions ──────────────────────────────────────────────────

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

# ─── NEW Feature 1: Semantic Search ──────────────────────────────────────────

@ai_bp.get("/search")
@jwt_required()
@limiter.limit("15 per hour")
@require_ai_quota
def semantic_search():
    """
    Semantic vector search over the user's notes.
    Falls back to keyword search if embeddings are unavailable.
    Query param: q (required), limit (optional, default 10)
    """
    q = request.args.get("q", "").strip()
    if not q:
        return jsonify({"detail": "Query parameter 'q' is required."}), 400

    limit = min(int(request.args.get("limit", 10)), 25)

    # Try semantic search first
    query_vector = embedding_service.embed_text(q)

    if query_vector:
        # Fetch all user note embeddings and rank by cosine similarity
        embeddings = (
            NoteEmbedding.query
            .join(Note, Note.id == NoteEmbedding.note_id)
            .filter(Note.owner_id == current_user.id, Note.is_archived == False)
            .all()
        )

        scored = []
        for emb in embeddings:
            if emb.embedding:
                score = embedding_service.cosine_similarity(query_vector, emb.embedding)
                scored.append((score, emb.note))

        scored.sort(key=lambda x: x[0], reverse=True)
        top_notes = [note for score, note in scored[:limit] if score > 0.3]

        results = [{
            "id": n.id,
            "title": n.title,
            "snippet": (n.content or "")[:200],
            "score": round(score, 4),
            "search_type": "semantic"
        } for score, n in scored[:limit] if score > 0.3]

        if results:
            return jsonify({"results": results, "search_type": "semantic"}), 200

    # Fallback: keyword search via SQL LIKE
    pattern = f"%{q}%"
    keyword_notes = Note.query.filter(
        Note.owner_id == current_user.id,
        Note.is_archived == False,
        db.or_(Note.title.ilike(pattern), Note.content.ilike(pattern))
    ).limit(limit).all()

    results = [{
        "id": n.id,
        "title": n.title,
        "snippet": (n.content or "")[:200],
        "score": None,
        "search_type": "keyword"
    } for n in keyword_notes]

    return jsonify({"results": results, "search_type": "keyword"}), 200

# ─── NEW Feature 2: Generate Draft ───────────────────────────────────────────

@ai_bp.post("/generate")
@jwt_required()
@limiter.limit("10 per hour")
@require_ai_quota
def generate_draft():
    data = request.get_json() or {}
    prompt = data.get("prompt", "").strip()
    if not prompt:
        return jsonify({"detail": "prompt is required."}), 400

    draft = ai_service.generate_draft(prompt)
    return jsonify(draft), 200

# ─── NEW Feature 3: Extract Action Items ──────────────────────────────────────

@ai_bp.post("/extract-actions")
@jwt_required()
@limiter.limit("20 per hour")
@require_ai_quota
def extract_actions():
    data = request.get_json() or {}
    content = data.get("content", "").strip()
    if not content:
        return jsonify({"detail": "content is required."}), 400

    items = ai_service.extract_action_items(content)
    return jsonify({"items": items}), 200

# ─── NEW Feature 4: Translate ─────────────────────────────────────────────────

@ai_bp.post("/translate")
@jwt_required()
@limiter.limit("20 per hour")
@require_ai_quota
def translate():
    data = request.get_json() or {}
    content = data.get("content", "").strip()
    target_language = data.get("target_language", "").strip()
    if not content:
        return jsonify({"detail": "content is required."}), 400
    if not target_language:
        return jsonify({"detail": "target_language is required."}), 400

    translated = ai_service.translate_content(content, target_language)
    return jsonify({"content": translated}), 200

# ─── NEW Feature 5: Brainstorm Ideas ─────────────────────────────────────────

@ai_bp.post("/brainstorm")
@jwt_required()
@limiter.limit("20 per hour")
@require_ai_quota
def brainstorm():
    data = request.get_json() or {}
    content = data.get("content", "").strip()
    if not content:
        return jsonify({"detail": "content is required."}), 400

    ideas = ai_service.brainstorm_ideas(content)
    return jsonify({"ideas": ideas}), 200

# ─── NEW: AI Quota Status ─────────────────────────────────────────────────────

@ai_bp.get("/quota")
@jwt_required()
def get_ai_quota():
    """Return the current user's AI usage quota status (used by SettingsModal)."""
    from datetime import datetime, timedelta
    from app.config import Config

    plan = getattr(current_user, "plan", "free") or "free"
    daily_limit = Config.AI_DAILY_LIMITS.get(plan, 20)
    count = getattr(current_user, "ai_usage_count", 0) or 0
    reset_at = getattr(current_user, "ai_usage_reset_at", None)

    # If reset_at is past 24h, user effectively has full quota
    now = datetime.utcnow()
    if reset_at and now >= reset_at + timedelta(hours=24):
        count = 0

    return jsonify({
        "plan": plan,
        "daily_limit": daily_limit,
        "used": count,
        "remaining": max(0, daily_limit - count),
        "resets_at": (reset_at + timedelta(hours=24)).isoformat() if reset_at else None
    }), 200
