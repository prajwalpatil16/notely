import api from "./client";

// ─── Existing ──────────────────────────────────────────────────────────────

export const chatWithMessage = (message, chatSessionId) =>
  api.post("/ai/chat", { message, chat_session_id: chatSessionId });

export const getRelatedSuggestions = (noteId) =>
  api.get(`/ai/related/${noteId}`);

export const getChatSessions = () =>
  api.get("/ai/sessions");

export const getSessionMessages = (sessionId) =>
  api.get(`/ai/sessions/${sessionId}/messages`);

// ─── Feature 1: Semantic Search ────────────────────────────────────────────

export const semanticSearch = (q, limit = 10) =>
  api.get("/ai/search", { params: { q, limit } });

// ─── Feature 2: Generate Draft ─────────────────────────────────────────────

export const generateDraft = (prompt) =>
  api.post("/ai/generate", { prompt });

// ─── Feature 3: Extract Action Items ───────────────────────────────────────

export const extractActionItems = (content) =>
  api.post("/ai/extract-actions", { content });

// ─── Feature 4: Translate ──────────────────────────────────────────────────

export const translateContent = (content, target_language) =>
  api.post("/ai/translate", { content, target_language });

// ─── Feature 5: Brainstorm ─────────────────────────────────────────────────

export const brainstormIdeas = (content) =>
  api.post("/ai/brainstorm", { content });

// ─── Quota Status ──────────────────────────────────────────────────────────

export const getAIQuota = () =>
  api.get("/ai/quota");
