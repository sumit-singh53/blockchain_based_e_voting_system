import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("token");
    if (!stored) return null;
    try {
      const decoded = jwtDecode(stored);
      return { voter_id: decoded.sub, role: decoded.role };
    } catch {
      return null;
    }
  });

  const login = ({ access_token, role }) => {
    localStorage.setItem("token", access_token);
    try {
      const decoded = jwtDecode(access_token);
      setUser({ voter_id: decoded.sub, role });
    } catch {
      setUser({ voter_id: null, role });
    }
    setToken(access_token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // Expire stale tokens on mount
  useEffect(() => {
    if (!token) return;
    try {
      const { exp } = jwtDecode(token);
      if (exp && Date.now() / 1000 > exp) logout();
    } catch {
      logout();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: Boolean(token) }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
export default AuthContext;
