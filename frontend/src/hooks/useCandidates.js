import { useState, useEffect } from "react";
import { listCandidates } from "../services/candidateService";

export const useCandidates = (electionId) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!electionId) {
      setCandidates([]);
      return;
    }
    let isMounted = true;
    setLoading(true);
    listCandidates(electionId)
      .then((res) => {
        if (isMounted) {
          setCandidates(res.data);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.response?.data?.detail || "Failed to fetch candidates");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [electionId]);

  return { candidates, loading, error };
};
