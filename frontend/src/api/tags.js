import api from "./client";

export const getTags = () => api.get("/tags/");
export const createTag = (data) => api.post("/tags/", data);
export const deleteTag = (id) => api.delete(`/tags/${id}`);
export const attachTagsToNote = (noteId, data) => api.post(`/tags/notes/${noteId}`, data);
