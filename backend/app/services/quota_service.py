"""
quota_service.py — AI usage quota enforcement.

Every AI route should call check_and_increment_ai_usage(current_user) before
doing any Gemini work. It auto-resets the counter daily and respects the
per-plan limit from Config.AI_DAILY_LIMITS.

Usage in a route:
    allowed, remaining = check_and_increment_ai_usage(current_user)
    if not allowed:
        return jsonify({"detail": "Daily AI quota reached. Resets tomorrow."}), 429

Or use the @require_ai_quota decorator directly on routes:
    @require_ai_quota
    def my_ai_route():
        ...
"""
from datetime import datetime, timedelta
from functools import wraps
from flask import jsonify
from flask_jwt_extended import current_user
from app.models import db
from app.config import Config


def check_and_increment_ai_usage(user) -> tuple[bool, int]:
    """
    Check whether the user is within their daily AI quota and increment the counter.

    Returns:
        (allowed: bool, remaining: int)
        allowed=False means the request must be rejected with 429.
    """
    now = datetime.utcnow()
    plan = getattr(user, "plan", "free") or "free"
    daily_limit = Config.AI_DAILY_LIMITS.get(plan, Config.AI_DAILY_LIMITS["free"])

    reset_at = getattr(user, "ai_usage_reset_at", None) or now
    count = getattr(user, "ai_usage_count", 0) or 0

    # Reset counter if it's been more than 24 hours since last reset
    if now >= reset_at + timedelta(hours=24):
        user.ai_usage_count = 0
        user.ai_usage_reset_at = now
        count = 0

    if count >= daily_limit:
        remaining = 0
        # Don't commit — no state change needed
        return False, remaining

    user.ai_usage_count = count + 1
    try:
        db.session.commit()
    except Exception:
        db.session.rollback()

    remaining = max(0, daily_limit - (count + 1))
    return True, remaining


def require_ai_quota(f):
    """
    Flask route decorator that checks AI quota before running the route handler.
    Must be placed AFTER @jwt_required() so current_user is populated.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        allowed, remaining = check_and_increment_ai_usage(current_user)
        if not allowed:
            plan = getattr(current_user, "plan", "free") or "free"
            limit = Config.AI_DAILY_LIMITS.get(plan, 20)
            return jsonify({
                "detail": f"Daily AI quota of {limit} actions reached. It resets every 24 hours. Upgrade your plan for a higher limit."
            }), 429
        return f(*args, **kwargs)
    return decorated
