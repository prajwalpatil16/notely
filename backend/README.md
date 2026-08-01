# Notely Backend Development Guide

This guide is specific to developers working on the Notely Flask API server.

---

## 1. Local Setup

### Prerequisites
* Python 3.11+
* Running MySQL server
* Google Gemini API key

### Installation Steps
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate   # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy the environment variables template and configure the values:
   ```bash
   cp .env.example .env
   ```

---

## 2. Environment Variables (`.env`)

Configure the following variables in your local `backend/.env` file:

* `FLASK_ENV`: The application environment (e.g., `development`, `production`).
* `SECRET_KEY`: Flask secret key used for session signing and cryptographic operations.
* `JWT_SECRET_KEY`: Secret key used for signing JSON Web Tokens.
* `DB_HOST`: Database hostname (usually `localhost`).
* `DB_PORT`: Database port (default MySQL port is `3306`).
* `DB_USER`: Database username.
* `DB_PASSWORD`: Database password.
* `DB_NAME`: Database schema/name (e.g., `noteapp`).
* `GEMINI_API_KEY`: API Key for Google Gemini services (`google-genai` integration).
* `RATE_LIMIT_DEFAULT`: Default Flask-Limiter policy (e.g., `100/hour`).
* `GOOGLE_CLIENT_ID`: (Optional) Client ID for verifying Google Sign-In tokens.

---

## 3. Database Migrations

Notely uses **Flask-Migrate** (based on **Alembic**) for database schema migrations.

* Run pending database migrations:
   ```bash
   flask db upgrade
   ```
* Create a new database migration after modifying SQLAlchemy models:
   ```bash
   flask db migrate -m "Describe your schema changes"
   ```

---

## 4. Running the Development Server

Start the Flask application using the built-in development server:
```bash
python app/main.py
```
By default, the server runs on `http://localhost:8000`.

---

## 5. Backend Blueprints & Endpoints

All API endpoints are prefixed with `/api`. The following routes are registered in the application:

* **Authentication (`/api/auth`)** - Handled by [`auth.py`](file:///Users/prajwal/Downloads/Noteapp/backend/app/routes/auth.py)
  * `POST /register`: Registers a new user.
  * `POST /login`: Authenticates credentials and returns access and refresh tokens.
  * `POST /google`: Authenticates Google client credentials.
  * `POST /refresh`: Issues a new JWT access token using a refresh token.
* **Notes (`/api/notes`)** - Handled by [`notes.py`](file:///Users/prajwal/Downloads/Noteapp/backend/app/routes/notes.py)
  * Handles standard CRUD operations for note records.
* **AI Utilities (`/api/ai`)** - Handled by [`ai.py`](file:///Users/prajwal/Downloads/Noteapp/backend/app/routes/ai.py)
  * `/ai/chat`: Interactive chat companion.
  * `/ai/improve`: Re-writes and improves note content.
  * `/ai/summarize`: Compiles bullet summaries of note content.
  * `/ai/suggest-tags`: Auto-tags notes based on content.
* **Folders (`/api/folders`)** - Handled by [`folders.py`](file:///Users/prajwal/Downloads/Noteapp/backend/app/routes/folders.py)
  * Manages note folders and custom groupings.
* **Tags (`/api/tags`)** - Handled by [`tags.py`](file:///Users/prajwal/Downloads/Noteapp/backend/app/routes/tags.py)
  * Handles custom organization labels.
* **Public Note Sharing (`/api/public`)** - Handled by [`public.py`](file:///Users/prajwal/Downloads/Noteapp/backend/app/routes/public.py)
  * Facilitates reading shared notes without active authentication.
* **Audit Logs (`/api/audit`)** - Handled by [`audit_logs.py`](file:///Users/prajwal/Downloads/Noteapp/backend/app/routes/audit_logs.py)
  * Provides access to recorded user audit logs.
* **Integrations (`/api/integrations`)** - Handled by [`integrations.py`](file:///Users/prajwal/Downloads/Noteapp/backend/app/routes/integrations.py)
  * Exposes integration details.
* **Templates (`/api/templates`)** - Handled by [`templates.py`](file:///Users/prajwal/Downloads/Noteapp/backend/app/routes/templates.py)
  * Provides default templates for starting notes.

---

## 6. Critical Security & Flow Notes

> [!WARNING]
> **Registration Authentication Flow Fix**  
> Historically, the `/api/auth/register` endpoint only returned the created user object in its JSON response without JWT tokens, causing the React frontend to fail its protected route check and bounce users back to the login screen.  
> **This has been fixed.** The `/register` endpoint now generates and returns `access_token` and `refresh_token` payloads identically to `/login`, logging the user in automatically upon successful registration. Ensure any new changes to the register handler maintain this token-inclusive response structure.
