import PropTypes from "prop-types";
import Button from "../ui/Button";

const VoteButton = ({ candidateId, onVote, disabled }) => {
  return (
    <Button
      variant="primary"
      className="w-full"
      disabled={disabled}
      onClick={() => onVote(candidateId)}
    >
      Cast Vote
    </Button>
  );
};

VoteButton.propTypes = {
  candidateId: PropTypes.string.isRequired,
  onVote: PropTypes.func,
  disabled: PropTypes.bool,
};

export default VoteButton;
