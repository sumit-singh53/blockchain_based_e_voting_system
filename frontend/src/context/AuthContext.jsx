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

  const login = ({ access_token, refresh_token, role }) => {
    localStorage.setItem("token", access_token);
    if (refresh_token) {
      localStorage.setItem("refresh_token", refresh_token);
    }
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
    localStorage.removeItem("refresh_token");
    setToken(null);
    setUser(null);
  };

  // We don't expire tokens instantly on mount anymore, we let the axios interceptor
  // handle the 401 Unauthorized via the refresh token.

  return (
    <AuthContext.Provider value={{ user, token, setToken, login, logout, isAuthenticated: Boolean(token) }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
export default AuthContext;
