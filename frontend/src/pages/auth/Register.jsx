import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register as registerApi } from "../../services/authService";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      await registerApi({ name: form.name, email: form.email, password: form.password });
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed.");
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
        <h2 className="text-2xl font-semibold text-slate-900">Create Account</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        {["name", "email", "password", "confirm"].map((field) => (
          <div key={field} className="space-y-1">
            <label className="text-sm text-slate-600 capitalize">
              {field === "confirm" ? "Confirm Password" : field}
            </label>
            <input
              name={field}
              type={field === "password" || field === "confirm" ? "password" : field === "email" ? "email" : "text"}
              value={form[field]}
              onChange={handleChange}
              required
              className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 hover:bg-slate-700 disabled:bg-slate-400 text-white py-2 rounded-lg font-semibold transition-colors"
        >
          {loading ? "Creating account…" : "Register"}
        </button>

        <p className="text-sm text-center text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="text-sky-600 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
