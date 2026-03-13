import { useEffect, useState } from "react";
import {
  listElections,
  createElection,
  updateElectionStatus,
} from "../../services/electionService";
import Modal from "../../components/ui/Modal";

const STATUS_ACTIONS = {
  draft: ["scheduled", "active"],
  scheduled: ["active", "draft"],
  active: ["completed"],
  completed: ["archived"],
  archived: [],
};

const statusColor = {
  draft: "bg-slate-100 text-slate-600",
  scheduled: "bg-blue-100 text-blue-700",
  active: "bg-green-100 text-green-700",
  completed: "bg-purple-100 text-purple-700",
  archived: "bg-gray-100 text-gray-500",
};

const ElectionControl = () => {
  const [elections, setElections] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", start_date: "", end_date: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const reload = () => listElections().then((r) => setElections(r.data));
  useEffect(() => { reload(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      await createElection({
        name: form.name,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
      });
      setShowCreate(false);
      setForm({ name: "", start_date: "", end_date: "" });
      reload();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create election.");
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (id, newStatus) => {
    await updateElectionStatus(id, { status: newStatus }).catch(() => {});
    reload();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Election Control</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          + New Election
        </button>
      </div>

      <div className="space-y-3">
        {elections.map((el) => (
          <div key={el.election_id} className="bg-white border border-slate-100 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-900">{el.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[el.status]}`}>{el.status}</span>
                {el.start_date && <span className="text-xs text-slate-400">{new Date(el.start_date).toLocaleDateString()}</span>}
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {(STATUS_ACTIONS[el.status] || []).map((s) => (
                <button
                  key={s}
                  onClick={() => changeStatus(el.election_id, s)}
                  className="text-xs px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 capitalize"
                >
                  → {s}
                </button>
              ))}
            </div>
          </div>
        ))}
        {elections.length === 0 && <p className="text-slate-400 text-sm">No elections yet.</p>}
      </div>

      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Create Election"
        footer={
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Cancel</button>
            <button form="create-election-form" type="submit" disabled={saving}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:bg-sky-300 text-white rounded-lg font-semibold">
              {saving ? "Creating…" : "Create"}
            </button>
          </div>
        }
      >
        <form id="create-election-form" onSubmit={handleCreate} className="space-y-3">
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div>
            <label className="text-sm text-slate-600">Election Name</label>
            <input required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400" />
          </div>
          <div>
            <label className="text-sm text-slate-600">Start Date (optional)</label>
            <input type="datetime-local" value={form.start_date} onChange={(e) => setForm((p) => ({ ...p, start_date: e.target.value }))}
              className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400" />
          </div>
          <div>
            <label className="text-sm text-slate-600">End Date (optional)</label>
            <input type="datetime-local" value={form.end_date} onChange={(e) => setForm((p) => ({ ...p, end_date: e.target.value }))}
              className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400" />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ElectionControl;
