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

  if (loading) return <p className="p-8 text-slate-400 dark:text-slate-500">Loading blockchain…</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Blockchain Explorer</h1>
        {valid !== null && (
          <span className={`text-sm px-3 py-1 rounded-full font-medium ${
            valid ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
          }`}>
            {valid ? "Chain Valid" : "Chain Invalid"}
          </span>
        )}
      </div>

      {stats && (
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-slate-700 dark:text-slate-300"><strong className="text-slate-900 dark:text-white">{stats.block_count}</strong> blocks</span>
          <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-slate-700 dark:text-slate-300"><strong className="text-slate-900 dark:text-white">{stats.pending_transactions}</strong> pending txs</span>
        </div>
      )}

      <div className="space-y-2">
        {chain.slice().reverse().map((block) => (
          <button
            key={block.index}
            onClick={() => setSelected(selected?.index === block.index ? null : block)}
            className={`w-full text-left bg-white dark:bg-slate-900 border ${selected?.index === block.index ? 'border-sky-300 dark:border-sky-700/50' : 'border-slate-100 dark:border-slate-800'} rounded-xl p-4 hover:border-sky-200 dark:hover:border-sky-800 transition-colors`}
          >
            <div className="flex justify-between items-center">
              <span className="font-mono text-sm text-slate-700 dark:text-slate-300">
                Block #{block.index} &mdash; {block.transactions.length} tx(s)
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">{new Date(block.timestamp).toLocaleString()}</span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 truncate font-mono">hash: {block.hash}</p>

            {selected?.index === block.index && (
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-slate-700 dark:text-slate-300">
                <p className="text-xs"><span className="font-medium text-slate-900 dark:text-white">Prev hash:</span> <span className="font-mono break-all text-slate-500 dark:text-slate-400">{block.previous_hash}</span></p>
                <p className="text-xs"><span className="font-medium text-slate-900 dark:text-white">Nonce:</span> {block.nonce}</p>
                {block.transactions.length > 0 && (
                  <div className="mt-2 text-left">
                    <p className="text-xs font-medium mb-1 text-slate-900 dark:text-white">Transactions:</p>
                    <div className="space-y-2">
                      {block.transactions.map((tx, i) => (
                        <div key={i} className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 space-y-1 font-mono">
                          <p><span className="font-medium text-slate-900 dark:text-white">Vote ID:</span> {tx.vote_id || "N/A"}</p>
                          <p><span className="font-medium text-slate-900 dark:text-white">Election:</span> {tx.election_id}</p>
                          <p><span className="font-medium text-slate-900 dark:text-white">Candidate:</span> {tx.candidate_id}</p>
                          <p className="break-all"><span className="font-medium text-slate-900 dark:text-white">Voter (pubkey):</span> {tx.voter_id}</p>
                        </div>
                      ))}
                    </div>
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
