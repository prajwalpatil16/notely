from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, current_user
from app.models import AuditLog

audit_logs_bp = Blueprint("audit_logs", __name__, url_prefix="/api/audit-logs")

@audit_logs_bp.get("/")
@jwt_required()
def get_audit_logs():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 50, type=int)
    
    pagination = AuditLog.query.filter_by(owner_id=current_user.id)\
        .order_by(AuditLog.created_at.desc())\
        .paginate(page=page, per_page=per_page, error_out=False)
        
    return jsonify({
        "items": [{
            "id": log.id,
            "action": log.action,
            "metadata": log.metadata_json or {},
            "created_at": log.created_at.isoformat()
        } for log in pagination.items],
        "total": pagination.total,
        "page": pagination.page,
        "pages": pagination.pages
    }), 200
