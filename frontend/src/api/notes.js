import api from "./client";

export const getNotes = (params) => api.get("/notes/", { params });
export const createNote = (data) => api.post("/notes/", data);
export const updateNote = (id, data) => api.put(`/notes/${id}`, data);
export const deleteNote = (id) => api.delete(`/notes/${id}`);

// Link Endpoints
export const getNoteLinks = () => api.get("/notes/links");
export const createNoteLink = (data) => api.post("/notes/links", data);
export const deleteNoteLink = (id) => api.delete(`/notes/links/${id}`);

// AI Endpoints
export const summarizeNote = (content) => api.post("/ai/summarize", { content });
export const suggestTags = (content) => api.post("/ai/suggest-tags", { content });
export const improveContent = (content) => api.post("/ai/improve", { content });
