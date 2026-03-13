import PropTypes from "prop-types";
import Card from "../ui/Card";

const formatHash = (hash = "") => `${hash.slice(0, 12)}...${hash.slice(-8)}`;

const BlockCard = ({ block }) => {
  return (
    <Card title={`Block #${block.index}`} subtitle={`Mined at ${block.timestamp}`}>
      <dl className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-slate-400">Hash</dt>
          <dd className="font-mono text-xs text-slate-600">{formatHash(block.hash)}</dd>
        </div>
        <div>
          <dt className="text-slate-400">Previous Hash</dt>
          <dd className="font-mono text-xs text-slate-600">{formatHash(block.previous_hash)}</dd>
        </div>
        <div>
          <dt className="text-slate-400">Transactions</dt>
          <dd className="text-slate-900 font-medium">{block.transactions?.length ?? 0}</dd>
        </div>
        <div>
          <dt className="text-slate-400">Nonce</dt>
          <dd className="text-slate-900 font-medium">{block.nonce}</dd>
        </div>
      </dl>
    </Card>
  );
};

BlockCard.propTypes = {
  block: PropTypes.shape({
    index: PropTypes.number,
    timestamp: PropTypes.string,
    hash: PropTypes.string,
    previous_hash: PropTypes.string,
    transactions: PropTypes.array,
    nonce: PropTypes.number,
  }).isRequired,
};

export default BlockCard;
