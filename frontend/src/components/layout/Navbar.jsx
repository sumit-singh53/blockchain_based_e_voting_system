import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, isVoter, logout } = useAuth();

  const publicLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/how-it-works", label: "How It Works" },
  ];

  const voterLinks = [
    { to: "/voter/dashboard", label: "Dashboard" },
    { to: "/voter/vote", label: "Vote" },
    { to: "/voter/results", label: "Results" },
    { to: "/voter/candidates", label: "Candidates" },
    { to: "/voter/profile", label: "Profile" },
    { to: "/voter/blockchain", label: "Blockchain" },
  ];

  const adminLinks = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/elections", label: "Elections" },
    { to: "/admin/candidates", label: "Candidates" },
    { to: "/admin/voters", label: "Voters" },
    { to: "/admin/results", label: "Results" },
    { to: "/admin/votes", label: "Votes" },
    { to: "/admin/blockchain", label: "Blockchain" },
  ];

  const links = [
    ...publicLinks,
    ...(isAdmin ? adminLinks : []),
    ...(isVoter ? voterLinks : []),
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-sky-600">
            eVoting
          </Link>
          <div className="flex items-center space-x-4 whitespace-nowrap">
            {links.map((link) => (
              <Link key={link.to} to={link.to} className="text-slate-600 hover:text-sky-600">
                {link.label}
              </Link>
            ))}
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="text-slate-600 hover:text-sky-600">Login</Link>
                <Link to="/register" className="bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold">
                  Register
                </Link>
              </>
            ) : (
              <button onClick={handleLogout} className="text-red-600 hover:text-red-700 text-sm font-semibold">
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
