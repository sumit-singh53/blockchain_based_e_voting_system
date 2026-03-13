import { useEffect, useState } from "react";
import { listVoters, updateVoter } from "../../services/voterService";

const ManageVoters = () => {
  const [voters, setVoters] = useState([]);
  const [filter, setFilter] = useState({ role: "", has_voted: "" });
  const [loading, setLoading] = useState(true);

  const reload = () => {
    setLoading(true);
    const params = {};
    if (filter.role) params.role = filter.role;
    if (filter.has_voted !== "") params.has_voted = filter.has_voted === "true";
    listVoters(params).then((r) => setVoters(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { reload(); }, [filter]); // eslint-disable-line

  const toggleRole = async (voter) => {
    const newRole = voter.role === "admin" ? "voter" : "admin";
    if (!window.confirm(`Change role to ${newRole}?`)) return;
    await updateVoter(voter.voter_id, { role: newRole }).catch(() => {});
    reload();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Manage Voters</h1>

      <div className="flex gap-3 flex-wrap">
        <select value={filter.role} onChange={(e) => setFilter((p) => ({ ...p, role: e.target.value }))}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
          <option value="">All Roles</option>
          <option value="voter">Voter</option>
          <option value="admin">Admin</option>
        </select>
        <select value={filter.has_voted} onChange={(e) => setFilter((p) => ({ ...p, has_voted: e.target.value }))}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
          <option value="">All Voting Status</option>
          <option value="true">Has Voted</option>
          <option value="false">Not Voted</option>
        </select>
      </div>

      {loading ? <p className="text-slate-400">Loading…</p> : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="text-left px-4 py-2">Name</th>
                <th className="text-left px-4 py-2 hidden sm:table-cell">Email</th>
                <th className="text-left px-4 py-2">Role</th>
                <th className="text-left px-4 py-2">Voted</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {voters.map((v) => (
                <tr key={v.voter_id}>
                  <td className="px-4 py-2 text-slate-900 font-medium">{v.name}</td>
                  <td className="px-4 py-2 text-slate-500 hidden sm:table-cell">{v.email}</td>
                  <td className="px-4 py-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      v.role === "admin" ? "bg-sky-100 text-sky-700" : "bg-slate-100 text-slate-600"
                    }`}>{v.role}</span>
                  </td>
                  <td className="px-4 py-2">{v.has_voted ? "✅" : "–"}</td>
                  <td className="px-4 py-2">
                    <button onClick={() => toggleRole(v)} className="text-xs text-sky-600 hover:underline">Toggle Role</button>
                  </td>
                </tr>
              ))}
              {voters.length === 0 && (
                <tr><td colSpan={5} className="text-center px-4 py-4 text-slate-400">No voters found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageVoters;
