from app.models import db, AuditLog

def log_action(owner_id, action, metadata=None):
    try:
        log_entry = AuditLog(
            owner_id=owner_id,
            action=action,
            metadata_json=metadata
        )
        db.session.add(log_entry)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        # Fail-silent for audit logging to not interrupt user workflow
        import sys
        print(f"Audit log failure: {e}", file=sys.stderr)
