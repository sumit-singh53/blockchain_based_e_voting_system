import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

const Sidebar = ({ links }) => {
  return (
    <aside className="w-64 bg-white dark:bg-[#0B0F19] border-r border-slate-100 dark:border-white/10 h-screen sticky top-0 transition-colors duration-300 z-10">
      <div className="p-6 border-b border-slate-100 dark:border-white/5">
        <p className="text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold">Dashboard</p>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-1">Control Panel</h2>
      </div>
      <nav className="p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive ? "bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

Sidebar.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      to: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Sidebar;
