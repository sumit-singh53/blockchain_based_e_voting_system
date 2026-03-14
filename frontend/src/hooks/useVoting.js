import { useState } from "react";
import { castVote as castVoteService } from "../services/voteService";

export const useVoting = () => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [receipt, setReceipt] = useState(null);

  const castVote = async (electionId, candidateId) => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await castVoteService({ election_id: electionId, candidate_id: candidateId });
      setReceipt(res.data);
      return res.data;
    } catch (err) {
      const errMessage = err.response?.data?.detail || "Vote submission failed.";
      setError(errMessage);
      throw new Error(errMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return { castVote, submitting, error, setError, receipt, setReceipt };
};
