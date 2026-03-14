import { useEffect, useState, useCallback } from "react";
import {
  listCandidates,
  createCandidate,
  updateCandidate,
  deleteCandidate,
} from "../services/candidateService";

export const useCandidateAdmin = (electionId) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Pagination State
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);

  const fetchCandidates = useCallback(async () => {
    if (!electionId) {
      setCandidates([]);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { data } = await listCandidates(electionId, limit, offset);
      setCandidates(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load candidates");
    } finally {
      setLoading(false);
    }
  }, [electionId, limit, offset]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const add = async (payload) => {
    await createCandidate({ ...payload, election_id: electionId });
    await fetchCandidates();
  };

  const update = async (id, payload) => {
    await updateCandidate(id, payload);
    await fetchCandidates();
  };

  const remove = async (id) => {
    await deleteCandidate(id);
    await fetchCandidates();
  };

  const nextPage = () => setOffset((prev) => prev + limit);
  const prevPage = () => setOffset((prev) => Math.max(0, prev - limit));

  return {
    candidates,
    loading,
    error,
    add,
    update,
    remove,
    nextPage,
    prevPage,
    hasMore: candidates.length === limit,
    offset,
  };
};
