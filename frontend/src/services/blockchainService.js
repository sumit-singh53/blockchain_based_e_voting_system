import api from "./api";

export const fetchChain = () => api.get("/blockchain/chain");
export const fetchBlock = (index) => api.get(`/blockchain/blocks/${index}`);
export const fetchStats = () => api.get("/blockchain/stats");
export const validateChain = () => api.get("/blockchain/validate");
export const fetchPending = () => api.get("/blockchain/pending");
export const mine = () => api.post("/blockchain/mine");
