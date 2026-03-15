import api from "./api";

export const listCandidates = (electionId, limit = 100, offset = 0) =>
  api.get("/candidates", {
    params: {
      ...(electionId && { election_id: electionId }),
      limit,
      offset,
    },
  });
export const getCandidate = (id) => api.get(`/candidates/${id}`);
export const createCandidate = (payload) => api.post("/candidates", payload);
export const updateCandidate = (id, payload) => api.patch(`/candidates/${id}`, payload);
export const deleteCandidate = (id) => api.delete(`/candidates/${id}`);
