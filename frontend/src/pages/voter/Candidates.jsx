import { useEffect, useState } from "react";
import { listElections } from "../../services/electionService";
import { listCandidates } from "../../services/candidateService";

const Candidates = () => {
  const [elections, setElections] = useState([]);
  const [electionId, setElectionId] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listElections().then((r) => setElections(r.data));
  }, []);

  useEffect(() => {
    if (!electionId) { setCandidates([]); return; }
    setLoading(true);
    listCandidates(electionId)
      .then((r) => setCandidates(r.data))
      .finally(() => setLoading(false));
  }, [electionId]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Candidates</h1>

      <select
        value={electionId}
        onChange={(e) => setElectionId(e.target.value)}
        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500/40 transition-colors"
      >
        <option value="">-- Select an election --</option>
        {elections.map((el) => (
          <option key={el.election_id} value={el.election_id}>{el.name}</option>
        ))}
      </select>

      {loading && <p className="text-slate-500 dark:text-slate-400 text-sm">Loading…</p>}

      <div className="space-y-3">
        {candidates.map((c) => (
          <div key={c.candidate_id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 space-y-1 transition-colors shadow-sm dark:shadow-none">
            <p className="font-semibold text-slate-900 dark:text-white">{c.name}</p>
            {c.party && <p className="text-sm text-slate-500 dark:text-slate-400">{c.party}</p>}
            {c.description && <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">{c.description}</p>}
          </div>
        ))}
        {!loading && electionId && candidates.length === 0 && (
          <p className="text-slate-500 dark:text-slate-400 text-sm">No candidates found for this election.</p>
        )}
      </div>
    </div>
  );
};

export default Candidates;
