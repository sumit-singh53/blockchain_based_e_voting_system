import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const Stat = ({ label, value, sub }) => (
  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
    <p className="text-sm text-slate-500">{label}</p>
    <p className="text-3xl font-bold text-slate-900 mt-1">{value ?? "…"}</p>
    {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/admin/dashboard"), api.get("/admin/recent-votes")])
      .then(([s, v]) => { setStats(s.data); setVotes(v.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-8 text-slate-400">Loading dashboard…</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Total Voters" value={stats?.total_voters} />
        <Stat label="Votes Cast" value={stats?.total_votes_cast} sub={`${stats?.voters_who_voted} voted`} />
        <Stat label="Elections" value={stats?.total_elections} sub={`${stats?.active_elections} active`} />
        <Stat label="Candidates" value={stats?.total_candidates} />
        <Stat label="Blocks" value={stats?.blockchain_length} />
        <Stat label="Pending Txs" value={stats?.pending_transactions} />
        <div className={`bg-white rounded-2xl border p-5 shadow-sm col-span-2 flex items-center gap-3 ${
          stats?.chain_valid ? "border-green-200" : "border-red-200"
        }`}>
          <span className={`text-2xl`}>{stats?.chain_valid ? "✅" : "❌"}</span>
          <div>
            <p className="font-semibold text-slate-900">Blockchain Integrity</p>
            <p className="text-sm text-slate-500">{stats?.chain_valid ? "All blocks valid" : "Chain validation failed!"}</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-slate-800">Recent Votes</h2>
          <Link to="/admin/results" className="text-sm text-sky-600 hover:underline">Full results →</Link>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="text-left px-4 py-2">Election</th>
                <th className="text-left px-4 py-2">Candidate</th>
                <th className="text-left px-4 py-2 hidden sm:table-cell">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {votes.slice(0, 10).map((v) => (
                <tr key={v.vote_id}>
                  <td className="px-4 py-2 text-slate-700">{v.election_name}</td>
                  <td className="px-4 py-2 text-slate-700">{v.candidate_name}</td>
                  <td className="px-4 py-2 text-slate-400 hidden sm:table-cell">{new Date(v.created_at).toLocaleString()}</td>
                </tr>
              ))}
              {votes.length === 0 && (
                <tr><td colSpan={3} className="px-4 py-4 text-center text-slate-400">No votes cast yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
