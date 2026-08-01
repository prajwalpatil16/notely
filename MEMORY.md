# Architecture Decisions Log — Notely

This log tracks key architectural decisions, past fixes, and design pivots in the development of Notely.

---

## 1. Database Primary Key Selection
* **Context**: The database prototype described in `schema.sql` initially used `VARCHAR(36)` columns to store UUID keys.
* **Decision**: During database integration, we moved to standard auto-incrementing `BigInteger` primary keys in our SQLAlchemy classes. This simplifies join constraints and optimizes lookup index speeds under MySQL InnoDB.

---

## 2. Gemini Model Pinning
* **Context**: Early implementations allowed arbitrary model overrides.
* **Decision**: We pinned models to:
  * `gemini-1.5-flash` (for summarization, improvements, and chat responses).
  * `text-embedding-004` (for vector semantic search).
* **Rationale**: Binds model tokens to the `google-genai` SDK and guarantees stability in vector dimension sizes (768).

---

## 3. Quotas & Limits Enforcements
* **Context**: Gemini API calls are subject to daily quota limits.
* **Decision**: Implemented `ai_usage_count` and `ai_usage_reset_at` columns directly in the `users` table to track API usage. A daily reset scheduler resets counts, and user limit checks block operations if the limit is exceeded (e.g., 20 actions/day on the Free tier).

---

## 4. Fix: Registration Endpoint Redirect Loop
* **Context**: When register completed, the page redirected to `/dashboard` and immediately bounced back to `/login` with no error message.
* **Diagnosis**: The `/auth/register` endpoint only returned basic user records but no JWT tokens. The frontend client-side store `authStore` set credentials to `undefined`, which triggered `ProtectedRoute` client-side redirects to `/login`.
* **Fix**: Updated the `/register` endpoint to return access and refresh tokens identical to `/login` response schemas. Registration now logs in the user automatically.
