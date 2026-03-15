import PropTypes from "prop-types";
import Card from "../ui/Card";
import Button from "../ui/Button";

const CandidateCard = ({ candidate, onSelect }) => {
  return (
    <Card className="flex flex-col gap-4">
      <div>
        <p className="text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500">Candidate</p>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{candidate.name}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{candidate.party}</p>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3">{candidate.manifesto}</p>
      <Button onClick={() => onSelect(candidate)} className="mt-auto">
        View Details
      </Button>
    </Card>
  );
};

CandidateCard.propTypes = {
  candidate: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    party: PropTypes.string,
    manifesto: PropTypes.string,
  }).isRequired,
  onSelect: PropTypes.func,
};

export default CandidateCard;
