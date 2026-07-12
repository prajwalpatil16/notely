from flask import Blueprint, request, jsonify, abort
from flask_jwt_extended import jwt_required, current_user
from app.models import db, Folder

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

    folder = Folder(name=name, owner_id=current_user.id)
    db.session.add(folder)
    db.session.commit()

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

    db.session.delete(folder)
    db.session.commit()
    return "", 204
