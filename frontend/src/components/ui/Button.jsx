import PropTypes from "prop-types";

const Button = ({ children, variant = "primary", className = "", ...rest }) => {
  const baseStyles = "px-4 py-2 rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-sky-600 text-white hover:bg-sky-500 focus:ring-sky-500",
    secondary: "bg-slate-800 text-white hover:bg-slate-700 focus:ring-slate-600",
    outline: "border border-slate-300 text-slate-900 hover:bg-slate-50 focus:ring-slate-300",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`.trim()} {...rest}>
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary", "outline"]),
  className: PropTypes.string,
};

export default Button;
