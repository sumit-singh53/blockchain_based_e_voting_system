import api from "./api";

export const listElections = (statusFilter) =>
  api.get("/elections", { params: statusFilter ? { status: statusFilter } : {} });
export const getElection = (id) => api.get(`/elections/${id}`);
export const createElection = (payload) => api.post("/elections", payload);
export const updateElectionStatus = (id, payload) => api.patch(`/elections/${id}/status`, payload);
