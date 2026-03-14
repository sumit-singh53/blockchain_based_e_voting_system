import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useElections } from "../../hooks/useElections";
import { useCandidates } from "../../hooks/useCandidates";
import { useVoting } from "../../hooks/useVoting";
import Modal from "../../components/ui/Modal";
import toast from "react-hot-toast";

const Vote = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preselect = searchParams.get("election");

  const [electionId, setElectionId] = useState(preselect || "");
  const [selected, setSelected] = useState("");
  const [confirm, setConfirm] = useState(false);

  const { elections, loading: loadingElections, error: electionsError } = useElections("active");
  const { candidates, loading: loadingCandidates, error: candidatesError } = useCandidates(electionId);
  const { castVote, submitting, error: voteError, setError: setVoteError, receipt } = useVoting();

  const handleVote = async () => {
    try {
      await castVote(electionId, selected);
      setConfirm(false);
      toast.success("Vote successfully cast!");
    } catch (err) {
      setConfirm(false);
      toast.error("Failed to cast vote. Please try again.");
    }
  };

  if (receipt) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-4">
        <div className="text-5xl">✅</div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Vote Recorded!</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Your vote has been added to the blockchain.</p>
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 text-left text-xs space-y-1 break-all text-slate-700 dark:text-slate-300">
          <p><span className="font-medium text-slate-900 dark:text-white">Vote ID:</span> {receipt.vote_id}</p>
          <p><span className="font-medium text-slate-900 dark:text-white">Block hash:</span> {receipt.tx_hash || "Pending"}</p>
          <p><span className="font-medium text-slate-900 dark:text-white">Time:</span> {new Date(receipt.created_at).toLocaleString()}</p>
        </div>
        <button onClick={() => navigate("/voter/dashboard")} className="text-sky-600 dark:text-sky-400 hover:underline text-sm font-medium">
          Back to dashboard
        </button>
      </div>
    );
  }

  const selectedCandidate = candidates.find((c) => c.candidate_id === selected);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Cast Your Vote</h1>

      {(voteError || electionsError || candidatesError) && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 text-sm px-4 py-2 rounded-lg">
          {voteError || electionsError || candidatesError}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Select Election</label>
        <select
          value={electionId}
          onChange={(e) => { setElectionId(e.target.value); setSelected(""); }}
          className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-sky-900/50 transition-colors"
        >
          <option value="">-- Choose an election --</option>
          {elections.map((el) => (
            <option key={el.election_id} value={el.election_id}>{el.name}</option>
          ))}
        </select>
      </div>

      {electionId && candidates.length === 0 && (
        <p className="text-slate-400 dark:text-slate-500 text-sm">No candidates in this election yet.</p>
      )}

      {candidates.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Select Candidate</p>
          {candidates.map((c) => (
            <label
              key={c.candidate_id}
              className={`flex items-start gap-3 border rounded-xl p-4 cursor-pointer transition-colors ${
                selected === c.candidate_id
                  ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20"
                  : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50"
              }`}
            >
              <input
                type="radio"
                name="candidate"
                value={c.candidate_id}
                checked={selected === c.candidate_id}
                onChange={() => setSelected(c.candidate_id)}
                className="mt-0.5 accent-sky-500"
              />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{c.name}</p>
                {c.party && <p className="text-sm text-slate-500 dark:text-slate-400">{c.party}</p>}
                {c.description && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{c.description}</p>}
              </div>
            </label>
          ))}
        </div>
      )}

      {selected && (
        <button
          onClick={() => setConfirm(true)}
          className="w-full bg-sky-600 hover:bg-sky-500 text-white py-2.5 rounded-xl font-semibold transition-colors"
        >
          Confirm Vote
        </button>
      )}

      <Modal
        isOpen={confirm}
        onClose={() => setConfirm(false)}
        title="Confirm Your Vote"
        footer={
          <div className="flex gap-2 justify-end">
            <button onClick={() => setConfirm(false)} className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">Cancel</button>
            <button
              onClick={handleVote}
              disabled={submitting}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:bg-sky-300 dark:disabled:bg-sky-800 text-white rounded-lg font-semibold transition-colors"
            >
              {submitting ? "Submitting…" : "Submit Vote"}
            </button>
          </div>
        }
      >
        <p className="text-slate-700 dark:text-slate-300">
          You are voting for <strong className="text-slate-900 dark:text-white">{selectedCandidate?.name}</strong>
          {selectedCandidate?.party && ` (${selectedCandidate.party})`}.
          This action <strong className="text-slate-900 dark:text-white">cannot be undone</strong>.
        </p>
      </Modal>
    </div>
  );
};

export default Vote;
