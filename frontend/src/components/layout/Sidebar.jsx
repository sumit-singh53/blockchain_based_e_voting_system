import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

const Sidebar = ({ links }) => {
  return (
    <aside className="w-64 bg-white border-r border-slate-100 h-screen sticky top-0">
      <div className="p-6 border-b border-slate-100">
        <p className="text-xs uppercase tracking-widest text-slate-400">Dashboard</p>
        <h2 className="text-xl font-semibold text-slate-900">Control Panel</h2>
      </div>
      <nav className="p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "bg-sky-50 text-sky-600" : "text-slate-600 hover:bg-slate-50"
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
