import api from "./client";

export const chatWithMessage = (message, chatSessionId) => 
  api.post("/ai/chat", { message, chat_session_id: chatSessionId });

export const getRelatedSuggestions = (noteId) => 
  api.get(`/ai/related/${noteId}`);

export const getChatSessions = () => 
  api.get("/ai/sessions");

export const getSessionMessages = (sessionId) => 
  api.get(`/ai/sessions/${sessionId}/messages`);
