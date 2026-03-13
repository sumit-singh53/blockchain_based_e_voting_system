import { useEffect, useState } from "react";
import { fetchStats, validateChain, fetchPending, mine } from "../../services/blockchainService";

const BlockchainMonitor = () => {
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [mining, setMining] = useState(false);
  const [mineResult, setMineResult] = useState(null);
  const [mineError, setMineError] = useState("");

  const reload = () => {
    Promise.all([fetchStats(), fetchPending()])
      .then(([s, p]) => { setStats(s.data); setPending(p.data); });
  };

  useEffect(() => { reload(); }, []);

  const handleMine = async () => {
    setMining(true); setMineResult(null); setMineError("");
    try {
      const { data } = await mine();
      setMineResult(data);
      reload();
    } catch (err) {
      setMineError(err.response?.data?.detail || "Mining failed.");
    } finally {
      setMining(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Blockchain Monitor</h1>

      {stats && (
        <div className="grid grid-cols-3 gap-4">
          {[{ label: "Blocks", value: stats.block_count }, { label: "Pending Txs", value: stats.pending_transactions }, { label: "Valid", value: stats.is_valid ? "✅" : "❌" }].map((s) => (
            <div key={s.label} className="bg-white border border-slate-100 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="text-sm text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white border border-slate-100 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">Pending Transactions ({pending.length})</h2>
          <button
            onClick={handleMine}
            disabled={mining || pending.length === 0}
            className="bg-sky-600 hover:bg-sky-500 disabled:bg-slate-200 disabled:text-slate-400 text-white px-4 py-1.5 rounded-lg text-sm font-semibold"
          >
            {mining ? "Mining…" : "Mine Block"}
          </button>
        </div>
        {mineResult && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-lg">
            Block #{mineResult.index} mined! Hash: <span className="font-mono text-xs break-all">{mineResult.hash}</span>
          </div>
        )}
        {mineError && <p className="text-red-600 text-sm">{mineError}</p>}

        {pending.length === 0 ? (
          <p className="text-slate-400 text-sm">No pending transactions.</p>
        ) : (
          <div className="space-y-2">
            {pending.map((tx, i) => (
              <div key={i} className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 space-y-0.5">
                <p><span className="font-medium">Election:</span> {tx.election_id}</p>
                <p><span className="font-medium">Candidate:</span> {tx.candidate_id}</p>
                <p><span className="font-medium">Time:</span> {tx.timestamp}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockchainMonitor;
