import re
import sys
from flask import Blueprint, request, jsonify, current_app
from app.models import db, User
from app import limiter
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    current_user
)

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

def validate_password(password):
    if len(password) < 8:
        return False, "Password must be at least 8 characters long."
    if not re.search(r"[A-Za-z]", password):
        return False, "Password must contain at least one letter."
    if not re.search(r"\d", password):
        return False, "Password must contain at least one number."
    return True, ""

@auth_bp.post("/register")
@limiter.limit("10 per hour")
def register():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")
    name = data.get("full_name") or data.get("name")

    if not email or not password:
        return jsonify({"detail": "Email and password are required."}), 400

    is_valid, msg = validate_password(password)
    if not is_valid:
        return jsonify({"detail": msg}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"detail": "This email already has an account — log in instead."}), 400

    user = User(email=email, name=name, auth_provider="password")
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "is_active": user.is_active
    }), 201

@auth_bp.post("/login")
@limiter.limit("20 per minute")
def login():
    if request.is_json:
        data = request.get_json() or {}
        email = data.get("email") or data.get("username")
        password = data.get("password")
    else:
        email = request.form.get("username") or request.form.get("email")
        password = request.form.get("password")

    if not email or not password:
        return jsonify({"detail": "Email and password are required."}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"detail": "That email isn't registered yet — sign up instead?"}), 401

    if not user.check_password(password):
        return jsonify({"detail": "Incorrect password."}), 401

    if not user.is_active:
        return jsonify({"detail": "User account is deactivated."}), 403

    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))

    return jsonify({
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "avatar_url": user.avatar_url
        }
    }), 200

@auth_bp.post("/google")
@limiter.limit("20 per minute")
def google_auth():
    data = request.get_json() or {}
    token = data.get("credential")
    if not token:
        return jsonify({"detail": "Google credential token is required."}), 400

    from google.oauth2 import id_token
    from google.auth.transport import requests

    try:
        idinfo = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            current_app.config["GOOGLE_CLIENT_ID"]
        )
        google_id = idinfo["sub"]
        email = idinfo["email"]
        name = idinfo.get("name", "")
        avatar_url = idinfo.get("picture", "")
    except ValueError as e:
        return jsonify({"detail": f"Google token verification failed: {str(e)}"}), 400

    user = User.query.filter_by(google_id=google_id).first()

    if not user:
        user = User.query.filter_by(email=email).first()
        if user:
            # Automatically link Google login to existing password-based account
            user.google_id = google_id
            if not user.avatar_url:
                user.avatar_url = avatar_url
            db.session.commit()
        else:
            # Create a new Google-only account
            user = User(
                email=email,
                name=name,
                google_id=google_id,
                auth_provider="google",
                avatar_url=avatar_url
            )
            db.session.add(user)
            db.session.commit()

    if not user.is_active:
        return jsonify({"detail": "This user account is deactivated."}), 403

    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))

    return jsonify({
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "avatar_url": user.avatar_url
        }
    }), 200

@auth_bp.post("/forgot-password")
@limiter.limit("5 per minute")
def forgot_password():
    data = request.get_json() or {}
    email = data.get("email")
    if not email:
        return jsonify({"detail": "Email address is required."}), 400

    from itsdangerous import URLSafeTimedSerializer

    user = User.query.filter_by(email=email).first()
    
    # Generic security message is returned regardless of email existence to prevent leakage
    if user and user.auth_provider == "password":
        s = URLSafeTimedSerializer(current_app.config["SECRET_KEY"])
        token = s.dumps(email, salt="password-reset-salt")
        
        # Log the timed URL to terminal stderr
        reset_url = f"http://localhost:5173/reset-password?token={token}"
        print(f"\n========================================\nPASSWORD RESET REQUEST\nEmail: {email}\nReset URL: {reset_url}\n========================================\n", file=sys.stderr, flush=True)

    return jsonify({"detail": "If that email is registered, we have sent a reset link to it."}), 200

@auth_bp.post("/reset-password")
@limiter.limit("5 per minute")
def reset_password():
    data = request.get_json() or {}
    token = data.get("token")
    password = data.get("password")

    if not token or not password:
        return jsonify({"detail": "Token and password are required."}), 400

    is_valid, msg = validate_password(password)
    if not is_valid:
        return jsonify({"detail": msg}), 400

    from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature

    s = URLSafeTimedSerializer(current_app.config["SECRET_KEY"])
    try:
        email = s.loads(token, salt="password-reset-salt", max_age=900)  # 15 minutes expiry
    except (SignatureExpired, BadSignature):
        return jsonify({"detail": "The reset link is invalid or has expired."}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"detail": "User not found."}), 400

    user.set_password(password)
    db.session.commit()

    return jsonify({"detail": "Password has been reset successfully."}), 200

@auth_bp.post("/refresh")
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    user = db.session.get(User, int(identity))
    if not user or not user.is_active:
        return jsonify({"detail": "User is inactive or deleted."}), 403
        
    new_access_token = create_access_token(identity=identity)
    return jsonify({"access_token": new_access_token, "token_type": "bearer"}), 200

@auth_bp.get("/me")
@jwt_required()
def me():
    return jsonify({
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name,
        "is_active": current_user.is_active,
        "avatar_url": current_user.avatar_url
    }), 200

@auth_bp.put("/me")
@jwt_required()
def update_profile():
    data = request.get_json() or {}
    name = data.get("name")
    current_password = data.get("current_password")
    new_password = data.get("new_password")

    if name is not None:
        name_str = name.strip()
        if not name_str:
            return jsonify({"detail": "Name cannot be empty."}), 400
        current_user.name = name_str

    if new_password:
        if current_user.auth_provider == "google":
            return jsonify({"detail": "Google accounts cannot change password directly."}), 400
        
        if not current_password:
            return jsonify({"detail": "Current password is required to set a new password."}), 400
            
        if not current_user.check_password(current_password):
            return jsonify({"detail": "Incorrect current password."}), 400
            
        is_valid, msg = validate_password(new_password)
        if not is_valid:
            return jsonify({"detail": msg}), 400
            
        current_user.set_password(new_password)

    db.session.commit()

    return jsonify({
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name,
        "is_active": current_user.is_active,
        "avatar_url": current_user.avatar_url
    }), 200
