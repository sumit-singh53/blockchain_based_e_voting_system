import api from "./api";

export const getMyProfile = () => api.get("/voters/me");
export const updateMyProfile = (payload) => api.patch("/voters/me", payload);
export const listVoters = (params) => api.get("/voters", { params });
export const updateVoter = (id, payload) => api.patch(`/voters/${id}`, payload);
