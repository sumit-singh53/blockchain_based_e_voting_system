import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login as loginApi } from "../../services/authService";
import useAuth from "../../hooks/useAuth";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

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
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
      {/* Left side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <motion.div 
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.5 }}
           className="w-full max-w-md space-y-8"
        >
          <div>
             <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-display tracking-tight">Welcome back</h2>
             <p className="mt-2 text-slate-600 dark:text-slate-400">Enter your credentials to access the voting portal.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div 
                 initial={{ opacity: 0, height: 0 }}
                 animate={{ opacity: 1, height: "auto" }}
                 className="bg-red-50/80 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-xl backdrop-blur-sm"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email address</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900/50 transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                  placeholder="you@example.com"
                />
              </div>

               <div className="space-y-1.5">
                 <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                 </div>
                 <input
                   name="password"
                   type="password"
                   value={form.password}
                   onChange={handleChange}
                   required
                   className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900/50 transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                   placeholder="••••••••"
                 />
               </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 dark:focus:ring-white dark:focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Authenticating…" : "Sign in securely"}
            </button>
          </form>

          <p className="text-sm text-center text-slate-600 dark:text-slate-400">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 transition-colors">
              Request access
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right side: branding/imagery */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between bg-slate-100 dark:bg-[#0B0F19] text-slate-900 dark:text-white p-12 relative overflow-hidden transition-colors duration-300">
         <div className="absolute inset-0 bg-gradient-to-bl from-indigo-200/40 dark:from-indigo-900/40 to-sky-200/40 dark:to-sky-900/40 mix-blend-overlay transition-colors" />
         
         <div className="relative z-10 flex flex-col items-end w-full">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold font-display tracking-tight text-slate-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
               <ShieldCheck className="w-6 h-6 text-sky-500 dark:text-sky-400" />
               Blockchain eVoting
            </Link>
         </div>

         <div className="relative z-10 max-w-md self-end text-right">
            <motion.h2 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5 }}
               className="text-4xl font-bold font-display leading-tight mb-4"
            >
               Cryptographic Identity Verification.
            </motion.h2>
            <motion.p 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5, delay: 0.1 }}
               className="text-slate-600 dark:text-slate-400 leading-relaxed text-balance"
            >
               The authentication node verifies your credentials in milliseconds, issuing a 
               cryptographically signed JSON Web Token (JWT). This token securely grants 
               you access to the decentralized ledger without exposing your private data 
               to the network.
            </motion.p>
         </div>

         <div className="relative z-10 text-sm text-slate-500 dark:text-slate-500 text-right">
            &copy; {new Date().getFullYear()} National eVoting Infrastructure
         </div>
      </div>
    </div>
  );
};

export default Login;
