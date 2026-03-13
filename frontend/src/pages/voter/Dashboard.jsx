import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listElections } from "../../services/electionService";
import useAuth from "../../hooks/useAuth";

const statusBadge = {
  draft: "bg-slate-100 text-slate-600",
  scheduled: "bg-blue-100 text-blue-700",
  active: "bg-green-100 text-green-700",
  completed: "bg-purple-100 text-purple-700",
  archived: "bg-gray-100 text-gray-500",
};

const Dashboard = () => {
  const { user } = useAuth();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    listElections()
      .then((r) => setElections(r.data))
      .catch(() => setError("Could not load elections."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="text-slate-500 text-sm mt-1">{user?.voter_id && `Voter ID: ${user.voter_id}`}</p>
      </div>

      <h2 className="text-lg font-semibold text-slate-800">Elections</h2>

      {loading && <p className="text-slate-500">Loading elections…</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && elections.length === 0 && (
        <p className="text-slate-500">No elections available at the moment.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {elections.map((el) => (
          <div key={el.election_id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-slate-900">{el.name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge[el.status] || ""}`}>
                {el.status}
              </span>
            </div>
            {el.start_date && (
              <p className="text-xs text-slate-400">
                {new Date(el.start_date).toLocaleDateString()} – {el.end_date ? new Date(el.end_date).toLocaleDateString() : "TBD"}
              </p>
            )}
            <div className="flex gap-2 mt-auto">
              <Link
                to={`/voter/vote?election=${el.election_id}`}
                className={`flex-1 text-center text-sm py-1.5 rounded-lg font-medium transition-colors ${
                  el.status === "active"
                    ? "bg-sky-600 text-white hover:bg-sky-500"
                    : "bg-slate-100 text-slate-400 pointer-events-none"
                }`}
              >
                {el.status === "active" ? "Vote Now" : "Voting Unavailable"}
              </Link>
              <Link
                to={`/voter/results?election=${el.election_id}`}
                className="flex-1 text-center text-sm py-1.5 rounded-lg font-medium bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Results
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
