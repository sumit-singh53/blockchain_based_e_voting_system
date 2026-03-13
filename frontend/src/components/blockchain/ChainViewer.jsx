import PropTypes from "prop-types";
import BlockCard from "./BlockCard";

const ChainViewer = ({ chain = [] }) => {
  return (
    <section className="space-y-4">
      {chain.map((block) => (
        <BlockCard key={block.hash || block.index} block={block} />
      ))}
      {chain.length === 0 && (
        <p className="text-sm text-slate-500">No blockchain data available yet.</p>
      )}
    </section>
  );
};

ChainViewer.propTypes = {
  chain: PropTypes.arrayOf(PropTypes.object),
};

export default ChainViewer;
