# Coding Standards & Conventions — Notely

This guide outlines rules and code conventions for developers working on the Notely workspace.

---

## 1. General Principles
* **Security First**: Never check in passwords or API keys. Always use environment variables fetched via `os.environ` or `.env` files.
* **No Placeholders**: Never write incomplete placeholder code or fallback blocks that bypass errors silently.

---

## 2. Frontend Conventions (React)
* **Component Patterns**: Use functional components with hooks. Put global store hooks in the `store` folder and data hooks in the `hooks` folder.
* **Styling**: Use Tailwind CSS v4 styling rules. Keep colors aligned with the warm-canvas palette (`bg-[#FAF7F2]`, canvas outlines `border-[#E7DED3]`, orange brand accents `bg-[#D97745]`).
* **State Management**:
  * Use Zustand stores for client UI theme and token session states.
  * Use React Query for caching API endpoints (notes, folders, tags). Do not mix them.
* **Navigation**: Always verify client-side security checks inside the `ProtectedRoute` wrapper.

---

## 3. Backend Conventions (Flask & SQLAlchemy)
* **Blueprints**: All routes must be modularized into Flask Blueprints and registered inside `app/__init__.py`'s `create_app` factory.
* **JWT Access**: Secure endpoints with `@jwt_required()` decorators. Use `current_user` to query resources scoped to the authenticated caller:
  ```python
  @notes_bp.get("")
  @jwt_required()
  def get_notes():
      # Scoped to caller only
      notes = Note.query.filter_by(owner_id=current_user.id).all()
  ```
* **Limiting & Quotas**: Annotate public/auth endpoints with `@limiter.limit()` to prevent denial of service. Validate quotas per plan limit checks prior to record allocation.
* **Auto-commit**: Ensure `db.session.commit()` is called within standard try-except blocks, raising explicit HTTP exceptions on database constraint errors.

---

## 4. Database Schema Conventions
* **ORM First**: Avoid writing manual SQL scripts to modify schema tables. Modifying the database schema must begin by editing the SQLAlchemy model classes in [`backend/app/models/__init__.py`](file:///Users/prajwal/Downloads/Noteapp/backend/app/models/__init__.py).
* **Migrations**: Always run `flask db migrate -m "Description"` followed by `flask db upgrade` to modify schemas. Keep the migrations directory in sync with source control.
