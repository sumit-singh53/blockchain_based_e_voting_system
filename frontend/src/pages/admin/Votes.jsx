import { useEffect, useState } from "react";
import api from "../../services/api";

const Votes = () => {
  const [limit, setLimit] = useState(50);
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadVotes = () => {
    setLoading(true);
    setError("");
    api
      .get(`/admin/recent-votes?limit=${limit}`)
      .then((r) => setVotes(r.data))
      .catch((e) => setError(e.response?.data?.detail || "Failed to fetch votes."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadVotes();
  }, [limit]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Votes Oversight</h1>
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
        >
          {[20, 50, 100, 200].map((n) => (
            <option key={n} value={n}>Last {n}</option>
          ))}
        </select>
      </div>

      {loading && <p className="text-slate-400">Loading votes…</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {!loading && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="text-left px-4 py-2">Vote ID</th>
                <th className="text-left px-4 py-2">Election</th>
                <th className="text-left px-4 py-2">Candidate</th>
                <th className="text-left px-4 py-2">Tx Hash</th>
                <th className="text-left px-4 py-2 hidden md:table-cell">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {votes.map((v) => (
                <tr key={v.vote_id}>
                  <td className="px-4 py-2 text-slate-700">{v.vote_id}</td>
                  <td className="px-4 py-2 text-slate-700">{v.election_name}</td>
                  <td className="px-4 py-2 text-slate-700">{v.candidate_name}</td>
                  <td className="px-4 py-2 text-xs text-slate-500 font-mono max-w-[240px] truncate">{v.tx_hash || "-"}</td>
                  <td className="px-4 py-2 text-slate-400 hidden md:table-cell">{new Date(v.created_at).toLocaleString()}</td>
                </tr>
              ))}
              {votes.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-center text-slate-400">No votes found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Votes;
