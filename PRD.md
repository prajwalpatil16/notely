# Product Requirements Document (PRD) — Notely

Notely is a premium notes application integrated with an AI companion that analyzes notes, answers natural language queries with citations, and automatically visualizes relationships between ideas.

---

## 1. Core Features

### AI Companion
* **Chat Interface**: An interactive side drawer where users can query their notes using natural language.
* **Citations**: AI responses must cite specific source note IDs so users can reference the source material immediately.
* **History**: Stores chat sessions and logs chat messages.

### Knowledge Map
* **Visual Graph**: An interactive, force-directed network graph displaying note connections.
* **Connection Types**:
  * `manual`: Connections created by the user.
  * `ai_suggested`: Semantic connections computed automatically.

### Organization
* **Folders**: Manual grouping of note lists.
* **Tags**: Color-coded labels that can be assigned manually or via AI suggestions.

### AI Writing Utilities
* **Summarize**: Instantly generates bullet summaries of note content.
* **Improve Writing**: Enhances and refines drafts.
* **Suggest Tags**: Auto-recommends relevant tags based on content.
* **AI Draft Generation**: Creates new notes from text prompts.

### Note History & Version Control
* Auto-saves note states and keeps incremental edits in the database to allow users to restore previous versions from a sidebar drawer.

### Note Sharing
* Generates secure public share links so non-registered users can read specific notes.

### Audit Logging
* Records security events and user actions (logins, folder creation, note deletion) for account auditability.

---

## 2. Plan Limits & Quotas

The application enforces tiered limits on folders, notes, storage, and AI daily actions to manage database resources and API costs:

| Tier | Max Folders | Max Notes | Max Storage Bytes | AI Actions / Day |
| :--- | :--- | :--- | :--- | :--- |
| **Free** | 5 | 50 | 50,000 | 20 |
| **Pro** | Unlimited (999,999) | Unlimited (999,999) | 500,000,000 | Unlimited (99,999) |
| **Business** | Unlimited (999,999) | Unlimited (999,999) | 500,000,000 | Unlimited (99,999) |
| **Enterprise** | Unlimited (999,999) | Unlimited (999,999) | 500,000,000 | Unlimited (99,999) |
