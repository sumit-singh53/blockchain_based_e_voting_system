import { useEffect, useState } from "react";
import { listElections } from "../../services/electionService";
import { listCandidates, createCandidate, updateCandidate, deleteCandidate } from "../../services/candidateService";
import Modal from "../../components/ui/Modal";

const ManageCandidates = () => {
  const [elections, setElections] = useState([]);
  const [electionId, setElectionId] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", party: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { listElections().then((r) => setElections(r.data)); }, []);

  const reload = () => {
    if (!electionId) return;
    listCandidates(electionId).then((r) => setCandidates(r.data));
  };

  useEffect(() => { reload(); }, [electionId]); // eslint-disable-line

  const openAdd = () => { setEditing(null); setForm({ name: "", party: "", description: "" }); setError(""); setShowModal(true); };
  const openEdit = (c) => { setEditing(c); setForm({ name: c.name, party: c.party || "", description: c.description || "" }); setError(""); setShowModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      if (editing) {
        await updateCandidate(editing.candidate_id, { name: form.name, party: form.party || null, description: form.description || null });
      } else {
        await createCandidate({ election_id: electionId, name: form.name, party: form.party || null, description: form.description || null });
      }
      setShowModal(false);
      reload();
    } catch (err) {
      setError(err.response?.data?.detail || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this candidate?")) return;
    await deleteCandidate(id).catch(() => {});
    reload();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Manage Candidates</h1>

      <div className="flex gap-3 flex-wrap">
        <select value={electionId} onChange={(e) => setElectionId(e.target.value)}
          className="flex-1 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400">
          <option value="">-- Select election --</option>
          {elections.map((el) => <option key={el.election_id} value={el.election_id}>{el.name}</option>)}
        </select>
        {electionId && (
          <button onClick={openAdd} className="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">
            + Add Candidate
          </button>
        )}
      </div>

      <div className="space-y-3">
        {candidates.map((c) => (
          <div key={c.candidate_id} className="bg-white border border-slate-100 rounded-xl p-4 flex items-start justify-between">
            <div>
              <p className="font-semibold text-slate-900">{c.name}</p>
              {c.party && <p className="text-sm text-slate-500">{c.party}</p>}
              {c.description && <p className="text-xs text-slate-400 mt-1">{c.description}</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(c)} className="text-xs px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50">Edit</button>
              <button onClick={() => handleDelete(c.candidate_id)} className="text-xs px-3 py-1 border border-red-200 text-red-600 rounded-lg hover:bg-red-50">Delete</button>
            </div>
          </div>
        ))}
        {electionId && candidates.length === 0 && <p className="text-slate-400 text-sm">No candidates yet.</p>}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? "Edit Candidate" : "Add Candidate"}
        footer={
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Cancel</button>
            <button form="candidate-form" type="submit" disabled={saving}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:bg-sky-300 text-white rounded-lg font-semibold">
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        }>
        <form id="candidate-form" onSubmit={handleSave} className="space-y-3">
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {["name", "party", "description"].map((f) => (
            <div key={f}>
              <label className="text-sm text-slate-600 capitalize">{f}</label>
              <input value={form[f]} onChange={(e) => setForm((p) => ({ ...p, [f]: e.target.value }))}
                required={f === "name"}
                className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400" />
            </div>
          ))}
        </form>
      </Modal>
    </div>
  );
};

export default ManageCandidates;
