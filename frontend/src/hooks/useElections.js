import { useState, useEffect } from "react";
import { listElections } from "../services/electionService";

export const useElections = (statusFilter = "") => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    listElections(statusFilter)
      .then((res) => {
        if (isMounted) {
          setElections(res.data);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.response?.data?.detail || "Failed to fetch elections");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [statusFilter]);

  return { elections, loading, error };
};
