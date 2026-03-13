import api from "./api";

export const login = (credentials) => api.post("/auth/login", credentials);
export const register = (payload) => api.post("/auth/register", payload);
export const refreshToken = () => api.post("/auth/refresh");
