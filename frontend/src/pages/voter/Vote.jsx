import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { listElections } from "../../services/electionService";
import { listCandidates } from "../../services/candidateService";
import { castVote } from "../../services/voteService";
import Modal from "../../components/ui/Modal";

const Vote = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preselect = searchParams.get("election");

  const [elections, setElections] = useState([]);
  const [electionId, setElectionId] = useState(preselect || "");
  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    listElections("active").then((r) => setElections(r.data));
  }, []);

  useEffect(() => {
    if (!electionId) { setCandidates([]); return; }
    listCandidates(electionId).then((r) => setCandidates(r.data)).catch(() => setCandidates([]));
  }, [electionId]);

  const handleVote = async () => {
    setSubmitting(true);
    setError("");
    try {
      const { data } = await castVote({ election_id: electionId, candidate_id: selected });
      setReceipt(data);
      setConfirm(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Vote submission failed.");
      setConfirm(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (receipt) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-4">
        <div className="text-5xl">✅</div>
        <h2 className="text-2xl font-bold text-slate-900">Vote Recorded!</h2>
        <p className="text-slate-500 text-sm">Your vote has been added to the blockchain.</p>
        <div className="bg-slate-50 rounded-xl p-4 text-left text-xs space-y-1 break-all">
          <p><span className="font-medium">Vote ID:</span> {receipt.vote_id}</p>
          <p><span className="font-medium">Block hash:</span> {receipt.tx_hash || "Pending"}</p>
          <p><span className="font-medium">Time:</span> {new Date(receipt.created_at).toLocaleString()}</p>
        </div>
        <button onClick={() => navigate("/voter/dashboard")} className="text-sky-600 hover:underline text-sm">
          Back to dashboard
        </button>
      </div>
    );
  }

  const selectedCandidate = candidates.find((c) => c.candidate_id === selected);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Cast Your Vote</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-lg">{error}</div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Select Election</label>
        <select
          value={electionId}
          onChange={(e) => { setElectionId(e.target.value); setSelected(""); }}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
        >
          <option value="">-- Choose an election --</option>
          {elections.map((el) => (
            <option key={el.election_id} value={el.election_id}>{el.name}</option>
          ))}
        </select>
      </div>

      {electionId && candidates.length === 0 && (
        <p className="text-slate-400 text-sm">No candidates in this election yet.</p>
      )}

      {candidates.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700">Select Candidate</p>
          {candidates.map((c) => (
            <label
              key={c.candidate_id}
              className={`flex items-start gap-3 border rounded-xl p-4 cursor-pointer transition-colors ${
                selected === c.candidate_id
                  ? "border-sky-500 bg-sky-50"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name="candidate"
                value={c.candidate_id}
                checked={selected === c.candidate_id}
                onChange={() => setSelected(c.candidate_id)}
                className="mt-0.5"
              />
              <div>
                <p className="font-semibold text-slate-900">{c.name}</p>
                {c.party && <p className="text-sm text-slate-500">{c.party}</p>}
                {c.description && <p className="text-xs text-slate-400 mt-1">{c.description}</p>}
              </div>
            </label>
          ))}
        </div>
      )}

      {selected && (
        <button
          onClick={() => setConfirm(true)}
          className="w-full bg-sky-600 hover:bg-sky-500 text-white py-2.5 rounded-xl font-semibold"
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
            <button onClick={() => setConfirm(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Cancel</button>
            <button
              onClick={handleVote}
              disabled={submitting}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:bg-sky-300 text-white rounded-lg font-semibold"
            >
              {submitting ? "Submitting…" : "Submit Vote"}
            </button>
          </div>
        }
      >
        <p className="text-slate-700">
          You are voting for <strong>{selectedCandidate?.name}</strong>
          {selectedCandidate?.party && ` (${selectedCandidate.party})`}.
          This action <strong>cannot be undone</strong>.
        </p>
      </Modal>
    </div>
  );
};

export default Vote;
