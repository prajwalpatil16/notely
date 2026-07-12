import os
from flask import Flask, jsonify, abort
from app.config import Config
from app.models import db, User
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_cors import CORS

migrate = Migrate()
jwt = JWTManager()
cors = CORS()
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["100 per hour"] # Fallback if config is not picked up
)

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    
    # Enable CORS for frontend app
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
    
    limiter.init_app(app)
    app.config["RATELIMIT_DEFAULT"] = config_class.RATE_LIMIT_DEFAULT

    # JWT identity loading and active check (HIGH Security Issue Fix)
    @jwt.user_lookup_loader
    def user_lookup_callback(_jwt_header, jwt_data):
        identity = jwt_data["sub"]
        try:
            user_id = int(identity)
        except (ValueError, TypeError):
            return None
            
        user = db.session.get(User, user_id)
        if user is None:
            return None
        if not user.is_active:
            abort(403, description="User account is deactivated")
        return user

    # Register Blueprints
    from app.routes.auth import auth_bp
    from app.routes.notes import notes_bp
    from app.routes.folders import folders_bp
    from app.routes.tags import tags_bp
    from app.routes.ai import ai_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(notes_bp)
    app.register_blueprint(folders_bp)
    app.register_blueprint(tags_bp)
    app.register_blueprint(ai_bp)

    # Health check
    @app.route("/health")
    def health():
        return jsonify({"status": "ok", "service": "Notely AI (Flask)"})

    return app
