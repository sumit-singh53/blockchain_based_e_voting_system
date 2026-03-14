import { useEffect, useState } from "react";
import { getMyProfile, updateMyProfile } from "../../services/voterService";

const Profile = () => {
  const [form, setForm] = useState({ name: "", email: "" });
  const [original, setOriginal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getMyProfile()
      .then((r) => {
        setForm({ name: r.data.name, email: r.data.email });
        setOriginal(r.data);
      })
      .catch(() => setError("Could not load profile."))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg(""); setError("");
    try {
      await updateMyProfile({ name: form.name, email: form.email });
      setMsg("Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.detail || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-8 text-slate-500 dark:text-slate-400">Loading…</p>;

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Profile</h1>

      {original && (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 text-sm space-y-1 text-slate-500 dark:text-slate-400 transition-colors shadow-sm dark:shadow-none">
          <p><span className="font-medium text-slate-700 dark:text-slate-300">Role:</span> {original.role}</p>
          <p><span className="font-medium text-slate-700 dark:text-slate-300">Has Voted:</span> {original.has_voted ? "Yes" : "No"}</p>
          <p><span className="font-medium text-slate-700 dark:text-slate-300">Registered:</span> {new Date(original.registration_date).toLocaleDateString()}</p>
        </div>
      )}

      {msg && <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm px-4 py-3 rounded-lg flex items-center">{msg}</div>}
      {error && <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-lg flex items-center">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500/40 transition-colors"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500/40 transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-sky-600 hover:bg-sky-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 text-white py-2.5 rounded-lg font-bold transition-colors mt-2"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
