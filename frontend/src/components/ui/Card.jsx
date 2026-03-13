import PropTypes from "prop-types";

const Card = ({ title, subtitle, children, className = "" }) => {
  return (
    <div className={`bg-white shadow-sm border border-slate-100 rounded-xl p-6 ${className}`.trim()}>
      {(title || subtitle) && (
        <header className="mb-4">
          {title && <h3 className="text-lg font-semibold text-slate-900">{title}</h3>}
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </header>
      )}
      <div>{children}</div>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Card;
