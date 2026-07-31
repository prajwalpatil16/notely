import api from "./client";

export const getTemplates = () => api.get("/templates/");
export const createTemplate = (data) => api.post("/templates/", data);
export const deleteTemplate = (id) => api.delete(`/templates/${id}`);
