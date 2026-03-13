import PropTypes from "prop-types";
import Modal from "../ui/Modal";

const VoteConfirmation = ({ isOpen, candidate, onConfirm, onCancel }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="Confirm Your Vote"
      footer={
        <div className="flex justify-end gap-3">
          <button className="text-slate-500" onClick={onCancel}>
            Cancel
          </button>
          <button className="bg-sky-600 text-white px-4 py-2 rounded-md" onClick={onConfirm}>
            Confirm Vote
          </button>
        </div>
      }
    >
      <p className="text-slate-600">
        You are about to cast your vote for <span className="font-semibold">{candidate?.name}</span>.
      </p>
    </Modal>
  );
};

VoteConfirmation.propTypes = {
  isOpen: PropTypes.bool,
  candidate: PropTypes.shape({
    name: PropTypes.string,
  }),
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
};

export default VoteConfirmation;
