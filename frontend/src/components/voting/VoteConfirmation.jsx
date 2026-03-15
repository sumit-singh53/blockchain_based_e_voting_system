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
            <button className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 font-medium transition-colors" onClick={onCancel}>
              Cancel
            </button>
            <button className="bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400 text-white px-4 py-2 rounded-md font-semibold transition-colors" onClick={onConfirm}>
              Confirm Vote
            </button>
          </div>
        }
      >
        <p className="text-slate-600 dark:text-slate-300">
          You are about to cast your vote for <span className="font-semibold text-slate-900 dark:text-white">{candidate?.name}</span>.
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
