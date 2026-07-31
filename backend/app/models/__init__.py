from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from passlib.context import CryptContext

db = SQLAlchemy()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Junction table for notes and tags
note_tags = db.Table(
    "note_tags",
    db.Column("note_id", db.BigInteger, db.ForeignKey("notes.id", ondelete="CASCADE"), primary_key=True),
    db.Column("tag_id", db.BigInteger, db.ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True)
)

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=True)
    name = db.Column(db.String(100), nullable=True)
    google_id = db.Column(db.String(255), unique=True, nullable=True)
    auth_provider = db.Column(db.String(20), default="password", nullable=False)
    avatar_url = db.Column(db.String(255), nullable=True)
    bio = db.Column(db.Text, nullable=True)
    location = db.Column(db.String(100), nullable=True)
    website = db.Column(db.String(255), nullable=True)
    timezone = db.Column(db.String(50), nullable=True, default="UTC")
    language = db.Column(db.String(10), nullable=True, default="en")
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    plan = db.Column(db.String(20), default="free", nullable=False)
    # AI quota tracking — reset daily, enforced per-plan in quota_service.py
    ai_usage_count = db.Column(db.Integer, default=0, nullable=False)
    ai_usage_reset_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    notes = db.relationship("Note", back_populates="owner", cascade="all, delete-orphan")
    folders = db.relationship("Folder", back_populates="owner", cascade="all, delete-orphan")
    tags = db.relationship("Tag", back_populates="owner", cascade="all, delete-orphan")
    note_links = db.relationship("NoteLink", back_populates="owner", cascade="all, delete-orphan")
    chat_sessions = db.relationship("ChatSession", back_populates="owner", cascade="all, delete-orphan")

    def set_password(self, password):
        self.password_hash = pwd_context.hash(password)

    def check_password(self, password):
        return pwd_context.verify(password, self.password_hash)

class Folder(db.Model):
    __tablename__ = "folders"

    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    owner_id = db.Column(db.BigInteger, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    owner = db.relationship("User", back_populates="folders")
    notes = db.relationship("Note", back_populates="folder")

class Tag(db.Model):
    __tablename__ = "tags"

    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    color = db.Column(db.String(7), default="#E85D30")
    owner_id = db.Column(db.BigInteger, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    owner = db.relationship("User", back_populates="tags")
    notes = db.relationship("Note", secondary=note_tags, back_populates="tags")

class Note(db.Model):
    __tablename__ = "notes"

    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    title = db.Column(db.String(255), nullable=False, default="Untitled")
    content = db.Column(db.Text, nullable=True)
    is_pinned = db.Column(db.Boolean, default=False, nullable=False)
    is_archived = db.Column(db.Boolean, default=False, nullable=False)
    owner_id = db.Column(db.BigInteger, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    folder_id = db.Column(db.BigInteger, db.ForeignKey("folders.id", ondelete="SET NULL"), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    version = db.Column(db.Integer, default=1, nullable=False)

    owner = db.relationship("User", back_populates="notes")
    folder = db.relationship("Folder", back_populates="notes")
    tags = db.relationship("Tag", secondary=note_tags, back_populates="notes")

    # Links out of this note, and in to this note
    links_out = db.relationship("NoteLink", foreign_keys="NoteLink.source_note_id", cascade="all, delete-orphan")
    links_in = db.relationship("NoteLink", foreign_keys="NoteLink.target_note_id", cascade="all, delete-orphan")

class NoteLink(db.Model):
    __tablename__ = "note_links"

    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    source_note_id = db.Column(db.BigInteger, db.ForeignKey("notes.id", ondelete="CASCADE"), nullable=False)
    target_note_id = db.Column(db.BigInteger, db.ForeignKey("notes.id", ondelete="CASCADE"), nullable=False)
    relation_type = db.Column(db.String(20), default="manual", nullable=False) # manual or ai_suggested
    owner_id = db.Column(db.BigInteger, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    owner = db.relationship("User", back_populates="note_links")

class ChatSession(db.Model):
    __tablename__ = "chat_sessions"

    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    owner_id = db.Column(db.BigInteger, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = db.Column(db.String(255), default="New Chat", nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    owner = db.relationship("User", back_populates="chat_sessions")
    messages = db.relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")

class ChatMessage(db.Model):
    __tablename__ = "chat_messages"

    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    session_id = db.Column(db.BigInteger, db.ForeignKey("chat_sessions.id", ondelete="CASCADE"), nullable=False)
    role = db.Column(db.String(20), nullable=False) # user or assistant
    content = db.Column(db.Text, nullable=False)
    cited_note_ids = db.Column(db.JSON, nullable=True) # JSON array of note ids
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    session = db.relationship("ChatSession", back_populates="messages")

class NoteRevision(db.Model):
    __tablename__ = "note_revisions"

    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    note_id = db.Column(db.BigInteger, db.ForeignKey("notes.id", ondelete="CASCADE"), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    note = db.relationship("Note", backref=db.backref("revisions", cascade="all, delete-orphan", passive_deletes=True))

class Template(db.Model):
    __tablename__ = "templates"

    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    owner_id = db.Column(db.BigInteger, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=True)
    category = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    owner = db.relationship("User", backref=db.backref("templates", cascade="all, delete-orphan", passive_deletes=True))

class NoteShare(db.Model):
    __tablename__ = "note_shares"

    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    note_id = db.Column(db.BigInteger, db.ForeignKey("notes.id", ondelete="CASCADE"), nullable=False)
    owner_id = db.Column(db.BigInteger, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    share_token = db.Column(db.String(100), unique=True, nullable=False, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    revoked_at = db.Column(db.DateTime, nullable=True)

    note = db.relationship("Note", backref=db.backref("shares", cascade="all, delete-orphan", passive_deletes=True))
    owner = db.relationship("User", backref=db.backref("note_shares", cascade="all, delete-orphan", passive_deletes=True))

class AuditLog(db.Model):
    __tablename__ = "audit_logs"

    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    owner_id = db.Column(db.BigInteger, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    action = db.Column(db.String(50), nullable=False)
    metadata_json = db.Column(db.JSON, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    owner = db.relationship("User", backref=db.backref("audit_logs", cascade="all, delete-orphan", passive_deletes=True))

class NoteEmbedding(db.Model):
    """Stores a Gemini text-embedding-004 vector per note for semantic search."""
    __tablename__ = "note_embeddings"

    id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    note_id = db.Column(db.BigInteger, db.ForeignKey("notes.id", ondelete="CASCADE"), unique=True, nullable=False)
    # Stored as a JSON array of floats (768-dim for text-embedding-004)
    embedding = db.Column(db.JSON, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    note = db.relationship("Note", backref=db.backref("embedding", uselist=False, cascade="all, delete-orphan", passive_deletes=True))
