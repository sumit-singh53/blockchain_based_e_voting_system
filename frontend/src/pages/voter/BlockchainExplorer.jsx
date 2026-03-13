import { useEffect, useState } from "react";
import { fetchChain, fetchStats, validateChain } from "../../services/blockchainService";

const BlockchainExplorer = () => {
  const [chain, setChain] = useState([]);
  const [stats, setStats] = useState(null);
  const [valid, setValid] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchChain(), fetchStats(), validateChain()])
      .then(([chainRes, statsRes, validRes]) => {
        setChain(chainRes.data);
        setStats(statsRes.data);
        setValid(validRes.data.is_valid);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-8 text-slate-400">Loading blockchain…</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Blockchain Explorer</h1>
        {valid !== null && (
          <span className={`text-sm px-3 py-1 rounded-full font-medium ${
            valid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {valid ? "Chain Valid" : "Chain Invalid"}
          </span>
        )}
      </div>

      {stats && (
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="bg-slate-100 px-3 py-1 rounded-full"><strong>{stats.block_count}</strong> blocks</span>
          <span className="bg-slate-100 px-3 py-1 rounded-full"><strong>{stats.pending_transactions}</strong> pending txs</span>
        </div>
      )}

      <div className="space-y-2">
        {chain.slice().reverse().map((block) => (
          <button
            key={block.index}
            onClick={() => setSelected(selected?.index === block.index ? null : block)}
            className="w-full text-left bg-white border border-slate-100 rounded-xl p-4 hover:border-sky-200 transition-colors"
          >
            <div className="flex justify-between items-center">
              <span className="font-mono text-sm text-slate-700">
                Block #{block.index} &mdash; {block.transactions.length} tx(s)
              </span>
              <span className="text-xs text-slate-400">{new Date(block.timestamp).toLocaleString()}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1 truncate font-mono">hash: {block.hash}</p>

            {selected?.index === block.index && (
              <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                <p className="text-xs"><span className="font-medium">Prev hash:</span> <span className="font-mono break-all">{block.previous_hash}</span></p>
                <p className="text-xs"><span className="font-medium">Nonce:</span> {block.nonce}</p>
                {block.transactions.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium mb-1">Transactions:</p>
                    {block.transactions.map((tx, i) => (
                      <div key={i} className="text-xs text-slate-500 bg-slate-50 rounded p-2 space-y-0.5">
                        <p><span className="font-medium">Election:</span> {tx.election_id}</p>
                        <p><span className="font-medium">Candidate:</span> {tx.candidate_id}</p>
                        <p><span className="font-medium">Voter (anon):</span> {tx.voter_id}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BlockchainExplorer;
