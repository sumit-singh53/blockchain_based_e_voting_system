import PropTypes from "prop-types";

const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4">
        <header className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600" aria-label="Close modal">
            &times;
          </button>
        </header>
        <div className="px-6 py-4">{children}</div>
        {footer && <footer className="px-6 py-4 border-t border-slate-100">{footer}</footer>}
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.node,
  footer: PropTypes.node,
};

export default Modal;
