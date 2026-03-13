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

  if (loading) return <p className="p-8 text-slate-400">Loading…</p>;

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>

      {original && (
        <div className="bg-slate-50 rounded-xl p-4 text-sm space-y-1 text-slate-500">
          <p><span className="font-medium text-slate-700">Role:</span> {original.role}</p>
          <p><span className="font-medium text-slate-700">Has Voted:</span> {original.has_voted ? "Yes" : "No"}</p>
          <p><span className="font-medium text-slate-700">Registered:</span> {new Date(original.registration_date).toLocaleDateString()}</p>
        </div>
      )}

      {msg && <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2 rounded-lg">{msg}</div>}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm text-slate-600">Full Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-slate-600">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-sky-600 hover:bg-sky-500 disabled:bg-sky-300 text-white py-2 rounded-lg font-semibold"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
