import api from "./client";

export const getIntegrations = () => api.get("/integrations/");
