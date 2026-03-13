import api from "./api";

export const castVote = (payload) => api.post("/votes/cast", payload);
export const getResults = (electionId) => api.get(`/votes/results/${electionId}`);
