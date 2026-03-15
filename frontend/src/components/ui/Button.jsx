import PropTypes from "prop-types";

const Button = ({ children, variant = "primary", className = "", ...rest }) => {
  const baseStyles = "px-4 py-2 rounded-md font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-950";
  const variants = {
    primary: "bg-sky-600 text-white hover:bg-sky-500 focus:ring-sky-500",
    secondary: "bg-slate-800 text-white hover:bg-slate-700 focus:ring-slate-600 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-white",
    outline: "border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 focus:ring-slate-300 dark:focus:ring-slate-600",
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
