import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login as loginApi } from "../../services/authService";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || null;

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Email and password are required.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await loginApi(form);
      login(data);
      const dest = from || (data.role === "admin" ? "/admin/dashboard" : "/voter/dashboard");
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-semibold text-slate-900">Sign In</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm text-slate-600">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-slate-600">Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sky-600 hover:bg-sky-500 disabled:bg-sky-300 text-white py-2 rounded-lg font-semibold transition-colors"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>

        <p className="text-sm text-center text-slate-500">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-sky-600 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
