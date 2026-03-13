import { useAuthContext } from "../context/AuthContext";

const useAuth = () => {
  const ctx = useAuthContext();
  return {
    ...ctx,
    isAuthenticated: Boolean(ctx?.token),
    isAdmin: ctx?.user?.role === "admin",
    isVoter: ctx?.user?.role === "voter",
  };
};

export default useAuth;
