import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register as registerApi } from "../../services/authService";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

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
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
      {/* Left side: branding/imagery */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between bg-slate-100 dark:bg-[#0B0F19] text-slate-900 dark:text-white p-12 relative overflow-hidden transition-colors duration-300">
         <div className="absolute inset-0 bg-gradient-to-br from-sky-200/40 dark:from-sky-900/40 to-indigo-200/40 dark:to-indigo-900/40 mix-blend-overlay transition-colors" />
         
         <Link to="/" className="relative z-10 flex items-center gap-2 text-xl font-bold font-display tracking-tight text-slate-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 transition-colors w-max">
            <ShieldCheck className="w-6 h-6 text-sky-500 dark:text-sky-400" />
            Blockchain eVoting
         </Link>

         <div className="relative z-10 max-w-md">
            <motion.h2 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5 }}
               className="text-4xl font-bold font-display leading-tight mb-4"
            >
               Initialize Your Network Identity.
            </motion.h2>
            <motion.p 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5, delay: 0.1 }}
               className="text-slate-600 dark:text-slate-400 leading-relaxed text-balance"
            >
               By registering, your personal data is hashed and salted using bcrypt cost factors before ever touching the database. This creates a provable identity primitive that allows you to participate in decentralized consensus while remaining entirely pseudonymous to other voters.
            </motion.p>
         </div>

         <div className="relative z-10 text-sm text-slate-500">
            &copy; {new Date().getFullYear()} National eVoting Infrastructure
         </div>
      </div>

      {/* Right side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <motion.div 
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.5 }}
           className="w-full max-w-md space-y-8"
        >
          <div>
             <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-display tracking-tight">Create your account</h2>
             <p className="mt-2 text-slate-600 dark:text-slate-400">Enter your details to register as a secure voter.</p>
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
               {["name", "email", "password", "confirm"].map((field) => (
                 <div key={field} className="space-y-1.5">
                   <label className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                     {field === "confirm" ? "Confirm Password" : field}
                   </label>
                   <input
                     name={field}
                     type={field === "password" || field === "confirm" ? "password" : field === "email" ? "email" : "text"}
                     value={form[field]}
                     onChange={handleChange}
                     required
                     className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900/50 transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                     placeholder={field === 'email' ? 'you@example.com' : ''}
                   />
                 </div>
               ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 dark:focus:ring-white dark:focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Creating account…" : "Register"}
            </button>
          </form>

          <p className="text-sm text-center text-slate-600 dark:text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
