# Codebase Documentation-vs-Implementation Audit

This report presents a comprehensive audit of the **Notely** codebase, comparing its stated documentation against the actual implementation found in the database schema, frontend code, and backend code.

---

## 1. Documentation Summary (Step 1)

Only two documentation files exist in the codebase. All other requested documentation files are missing.

| File Path | Summary | Reflected Date/Version |
| :--- | :--- | :--- |
| [`README.md`](file:///Users/prajwal/Downloads/Noteapp/README.md) (root) | Outlines the core features (AI Companion, Knowledge Map, Folder/Tag organization, AI writing tools, Google Sign-In), specifies the technology stack (React 19, Tailwind CSS v4, Zustand, Flask, MySQL, Gemini), and details local development setup and environment variables. | None Stated |
| [`frontend/README.md`](file:///Users/prajwal/Downloads/Noteapp/frontend/README.md) | Standard React-Vite template README. Details HMR configuration, ESLint compiler settings, and suggestions for TypeScript integration. | None Stated |

### Missing Documentation Files (Do Not Exist):
- `backend/README.md`
- `PRD.md`
- `ARCHITECTURE.md`
- `RULES.md`
- `PHASES.md`
- `DESIGN.md`
- `MEMORY.md`

---

## 2. Documentation vs. Implementation Cross-Reference (Step 2)

| Claimed Feature / Specification | Documentation Source | Status | Evidence & Details |
| :--- | :--- | :--- | :--- |
| **AI Companion** (ask questions of notes, link back to source notes) | `README.md` | ✅ MATCHES | **Frontend**: [`ChatPanel.jsx`](file:///Users/prajwal/Downloads/Noteapp/frontend/src/components/ChatPanel.jsx) queries the AI drawer.<br>**Backend**: [`ai.py`](file:///Users/prajwal/Downloads/Noteapp/backend/app/routes/ai.py) runs chat prompts using Gemini (`google-genai`).<br>**Database**: [`chat_messages`](file:///Users/prajwal/Downloads/Noteapp/backend/app/models/__init__.py) stores references to notes via `cited_note_ids`. |
| **Knowledge Map** (automatic note connections) | `README.md` | ✅ MATCHES | **Frontend**: [`GraphView.jsx`](file:///Users/prajwal/Downloads/Noteapp/frontend/src/components/GraphView.jsx) renders a force-directed node map.<br>**Backend**: [`NoteLink`](file:///Users/prajwal/Downloads/Noteapp/backend/app/models/__init__.py) SQLAlchemy model stores link mappings (`manual` or `ai_suggested`). |
| **Folders & Tags** (manual & AI-suggested organization) | `README.md` | ✅ MATCHES | **Frontend**: [`NoteEditor.jsx`](file:///Users/prajwal/Downloads/Noteapp/frontend/src/components/NoteEditor.jsx) and [`Sidebar.jsx`](file:///Users/prajwal/Downloads/Noteapp/frontend/src/components/Sidebar.jsx) manage tags and folders. Tags are applied via `AIWidget` suggestions.<br>**Backend**: [`folders`, `tags`, `note_tags`](file:///Users/prajwal/Downloads/Noteapp/backend/app/models/__init__.py) models handle mappings. |
| **AI Writing Tools** (one-click summarize, improve, tag) | `README.md` | ✅ MATCHES | **Frontend**: [`AIWidget.jsx`](file:///Users/prajwal/Downloads/Noteapp/frontend/src/components/AIWidget.jsx) triggers one-click AI commands.<br>**Backend**: [`ai.py`](file:///Users/prajwal/Downloads/Noteapp/backend/app/routes/ai.py) exposes `/ai/improve`, `/ai/summarize`, and `/ai/suggest-tags` using Gemini. |
| **Google Sign-In** & Email Auth | `README.md` | ⚠️ PARTIAL | **Frontend**: [`Login.jsx`](file:///Users/prajwal/Downloads/Noteapp/frontend/src/pages/Login.jsx) and [`Register.jsx`](file:///Users/prajwal/Downloads/Noteapp/frontend/src/pages/Register.jsx) implement login buttons.<br>**Backend**: [`auth.py`](file:///Users/prajwal/Downloads/Noteapp/backend/app/routes/auth.py) handles credentials & Google tokens.<br>**Discrepancy (Bug)**: The backend registration endpoint does not return auth tokens (`access_token`, `refresh_token`), causing frontend client-side redirects to fail and send users back to `/login` immediately. |
| **Database Schema** | `README.md` & `backend/schema.sql` | ⚠️ PARTIAL | **Discrepancy**: [`backend/schema.sql`](file:///Users/prajwal/Downloads/Noteapp/backend/schema.sql) is obsolete. It defines 5 tables with `VARCHAR(36)` UUID keys. The actual schema in [`models/__init__.py`](file:///Users/prajwal/Downloads/Noteapp/backend/app/models/__init__.py) uses `BigInteger` auto-incrementing IDs and defines 8 additional tables (`note_links`, `chat_sessions`, `chat_messages`, `note_revisions`, `templates`, `note_shares`, `audit_logs`, `note_embeddings`). |
| **Tech Stack** | `README.md` | ✅ MATCHES | Confirmed in package files:<br>- **Frontend**: React 19, Tailwind CSS v4 (`package.json`) and Vite (`vite.config.js`).<br>- **Backend**: Flask, SQLAlchemy, JWT, Limiter, CORS (`requirements.txt`).<br>- **AI**: `google-genai` (`requirements.txt`).<br>- **Database**: MySQL (`config.py`). |
| **Quota & Plan Limits** | Undocumented | 🆕 UNDOCUMENTED | The backend restricts folders, notes, storage, and AI daily limits per user tier (Free, Pro, Business, Enterprise) in [`config.py`](file:///Users/prajwal/Downloads/Noteapp/backend/app/config.py) (`PLAN_LIMITS`, `AI_DAILY_LIMITS`). |
| **Note History & Revisions** | Undocumented | 🆕 UNDOCUMENTED | Database tracks revisions in `note_revisions`. [`NoteEditor.jsx`](file:///Users/prajwal/Downloads/Noteapp/frontend/src/components/NoteEditor.jsx) renders a Version History drawer to restore previous states. |
| **Public Note Sharing** | Undocumented | 🆕 UNDOCUMENTED | Shares notes using tokens in `note_shares` and renders shared notes in the public page [`SharedNote.jsx`](file:///Users/prajwal/Downloads/Noteapp/frontend/src/pages/SharedNote.jsx). |
| **Audit Logs** | Undocumented | 🆕 UNDOCUMENTED | Database tracks user actions in `audit_logs`, which can be inspected from the dashboard settings. |
| **Note Templates** | Undocumented | 🆕 UNDOCUMENTED | Model `Template` supports custom templates that can be loaded in the sidebar. |

---

## 3. Screenshots Index (Step 3)

The following screenshots have been successfully generated using a Playwright script executing on a Chromium instance (applying the requested CDP and sandbox bypass fixes) and are saved in the [`/screenshots`](file:///Users/prajwal/Downloads/Noteapp/screenshots) folder:

1. **[`homepage.png`](file:///Users/prajwal/Downloads/Noteapp/screenshots/homepage.png)**: The public homepage showcasing the value proposition of Notely.
2. **[`product.png`](file:///Users/prajwal/Downloads/Noteapp/screenshots/product.png)**: The product features page outlining folders, tags, and AI utilities.
3. **[`solutions.png`](file:///Users/prajwal/Downloads/Noteapp/screenshots/solutions.png)**: The solutions landing page for organizational playbooks.
4. **[`pricing.png`](file:///Users/prajwal/Downloads/Noteapp/screenshots/pricing.png)**: The plan listing for Free, Pro, Business, and Enterprise plans.
5. **[`register.png`](file:///Users/prajwal/Downloads/Noteapp/screenshots/register.png)**: The signup screen for creating new workspaces.
6. **[`login.png`](file:///Users/prajwal/Downloads/Noteapp/screenshots/login.png)**: The portal login screen.
7. **[`dashboard_empty.png`](file:///Users/prajwal/Downloads/Noteapp/screenshots/dashboard_empty.png)**: Authenticated dashboard empty state for newly created accounts.
8. **[`dashboard.png`](file:///Users/prajwal/Downloads/Noteapp/screenshots/dashboard.png)**: Active note editor and note list view on the dashboard.
9. **[`dashboard_chat.png`](file:///Users/prajwal/Downloads/Noteapp/screenshots/dashboard_chat.png)**: AI Companion chat panel open showing a semantic note query.
10. **[`dashboard_map.png`](file:///Users/prajwal/Downloads/Noteapp/screenshots/dashboard_map.png)**: Force-directed Knowledge Map showing interconnected notes.
11. **[`settings_profile.png`](file:///Users/prajwal/Downloads/Noteapp/screenshots/settings_profile.png)**: Settings modal showing profile configurations.
12. **[`settings_billing.png`](file:///Users/prajwal/Downloads/Noteapp/screenshots/settings_billing.png)**: Settings modal showing billing options and plans.

---

## 4. Documentation Health Verdict (Step 5)

**Overall Health Verdict**: **Outdated & Incomplete**

### Key Vulnerabilities:
1. **Outdated SQL Schema**: [`backend/schema.sql`](file:///Users/prajwal/Downloads/Noteapp/backend/schema.sql) is severely out of sync. It reflects an old schema utilizing UUID string IDs instead of the active `BigInteger` auto-incrementing structure and completely omits 8 tables that drive critical features (Note Sharing, Revisions, AI Chat, Knowledge Map links, Audit Logs, and Embeddings).
2. **Missing Feature Documentation**: A significant amount of the application is undocumented. There is no mention of note version histories, public link sharing, audit logging, template pickers, or pricing limits.
3. **Critical Registration Flow Discrepancy**: The backend `/auth/register` route does not return authorization tokens, leading to an immediate, unintended redirection back to `/login` on registration, which contradicts the design of the frontend.

### Urgent Updates Recommended:
- **Replace `backend/schema.sql`** with a schema dump matching the SQLAlchemy ORM models.
- **Write a new `ARCHITECTURE.md`** explaining the dual-redirect auth behavior, Gemini API integration, and how the Knowledge Map calculates connections.
