import { useEffect, useState } from "react";
import { listElections } from "../../services/electionService";
import { getResults } from "../../services/voteService";

const AdminResults = () => {
  const [elections, setElections] = useState([]);
  const [electionId, setElectionId] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { listElections().then((r) => setElections(r.data)); }, []);

  useEffect(() => {
    if (!electionId) { setResults(null); return; }
    setLoading(true);
    getResults(electionId).then((r) => setResults(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [electionId]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Election Results</h1>

      <select value={electionId} onChange={(e) => setElectionId(e.target.value)}
        className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400">
        <option value="">-- Select election --</option>
        {elections.map((el) => <option key={el.election_id} value={el.election_id}>{el.name} ({el.status})</option>)}
      </select>

      {loading && <p className="text-slate-400">Loading…</p>}

      {results && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">{results.total_votes} votes cast</span>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">{results.turnout_percentage}% turnout</span>
            <span className="bg-slate-100 px-3 py-1 rounded-full">{results.total_voters} registered</span>
          </div>
          <div className="space-y-3">
            {results.results.map((r, i) => (
              <div key={r.candidate_id} className="bg-white border border-slate-100 rounded-xl p-4">
                <div className="flex justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-slate-300">#{i + 1}</span>
                    <div>
                      <p className="font-semibold text-slate-900">{r.candidate_name}</p>
                      {r.party && <p className="text-xs text-slate-400">{r.party}</p>}
                    </div>
                  </div>
                  <span className="text-sm font-medium text-slate-700">{r.votes} ({r.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-sky-500 h-2 rounded-full" style={{ width: `${r.percentage}%` }} />
                </div>
              </div>
            ))}
            {results.results.length === 0 && <p className="text-slate-400 text-sm">No votes recorded yet.</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminResults;
