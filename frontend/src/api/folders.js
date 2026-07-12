import api from "./client";

export const getFolders = () => api.get("/folders/");
export const createFolder = (data) => api.post("/folders/", data);
export const deleteFolder = (id) => api.delete(`/folders/${id}`);
