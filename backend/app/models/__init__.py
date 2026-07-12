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
    is_active = db.Column(db.Boolean, default=True, nullable=False)
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
