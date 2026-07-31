from flask import Blueprint, request, jsonify, abort
from flask_jwt_extended import jwt_required, current_user
from app.models import db, Folder
from app.services.audit_service import log_action

folders_bp = Blueprint("folders", __name__, url_prefix="/api/folders")

@folders_bp.get("/")
@jwt_required()
def get_folders():
    folders = Folder.query.filter_by(owner_id=current_user.id).all()
    return jsonify([{
        "id": f.id,
        "name": f.name,
        "owner_id": f.owner_id,
        "created_at": f.created_at.isoformat()
    } for f in folders]), 200

@folders_bp.post("/")
@jwt_required()
def create_folder():
    data = request.get_json() or {}
    name = data.get("name")
    if not name:
        return jsonify({"detail": "Folder name is required."}), 400

    from app.config import Config
    
    plan = getattr(current_user, "plan", "free")
    limits = Config.PLAN_LIMITS.get(plan, Config.PLAN_LIMITS["free"])
    
    existing_folders_count = Folder.query.filter_by(owner_id=current_user.id).count()
    if existing_folders_count >= limits["max_folders"]:
        return jsonify({"detail": f"Folder limit reached. Upgrade to Pro for unlimited folders."}), 402

    folder = Folder(name=name, owner_id=current_user.id)
    db.session.add(folder)
    db.session.commit()

    log_action(current_user.id, "folder_create", {"folder_id": folder.id, "name": folder.name})

    return jsonify({
        "id": folder.id,
        "name": folder.name,
        "owner_id": folder.owner_id,
        "created_at": folder.created_at.isoformat()
    }), 201

@folders_bp.delete("/<int:folder_id>")
@jwt_required()
def delete_folder(folder_id):
    folder = Folder.query.filter_by(id=folder_id, owner_id=current_user.id).first()
    if not folder:
        abort(404, description="Folder not found.")

    log_action(current_user.id, "folder_delete", {"folder_id": folder.id, "name": folder.name})
    db.session.delete(folder)
    db.session.commit()
    return "", 204
