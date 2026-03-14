import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { listElections } from "../../services/electionService";
import { getResults } from "../../services/voteService";

const Results = () => {
  const [searchParams] = useSearchParams();
  const preselect = searchParams.get("election");

  const [elections, setElections] = useState([]);
  const [electionId, setElectionId] = useState(preselect || "");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    listElections().then((r) => setElections(r.data));
  }, []);

  useEffect(() => {
    if (!electionId) { setResults(null); return; }
    setLoading(true);
    getResults(electionId)
      .then((r) => setResults(r.data))
      .catch(() => setError("Could not load results."))
      .finally(() => setLoading(false));
  }, [electionId]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Election Results</h1>

      <select
        value={electionId}
        onChange={(e) => setElectionId(e.target.value)}
        className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-sky-900/50 transition-colors"
      >
        <option value="">-- Select an election --</option>
        {elections.map((el) => (
          <option key={el.election_id} value={el.election_id}>{el.name}</option>
        ))}
      </select>

      {loading && <p className="text-slate-400 dark:text-slate-500">Loading results…</p>}
      {error && <p className="text-red-500 dark:text-red-400">{error}</p>}

      {results && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full">
              <strong className="text-slate-900 dark:text-white">{results.total_votes}</strong> votes cast
            </span>
            <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full">
              <strong className="text-slate-900 dark:text-white">{results.turnout_percentage}%</strong> turnout
            </span>
            <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full">
              <strong className="text-slate-900 dark:text-white">{results.total_voters}</strong> registered voters
            </span>
          </div>

          <div className="space-y-3">
            {results.results.map((r, i) => (
              <div key={r.candidate_id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 space-y-2 transition-colors">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 mr-2">#{i + 1}</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{r.candidate_name}</span>
                    {r.party && <span className="ml-2 text-sm text-slate-400 dark:text-slate-500">{r.party}</span>}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{r.votes} votes ({r.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                  <div
                    className="bg-sky-500 h-2 rounded-full transition-all"
                    style={{ width: `${r.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;
