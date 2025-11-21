import React, { useEffect, useState } from "react";
import ShoutoutForm from "../features/authentication/shoutouts/components/ShoutoutForm";
import ShoutoutCard from "../features/authentication/shoutouts/components/ShoutoutCard";

import "../styles/shoutouts.css";




const API_URL = "http://127.0.0.1:8000/shoutouts";

export default function Shoutouts() {
  const [shoutouts, setShoutouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);

  const fetchShoutouts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch shoutouts");
      const data = await res.json();
      setShoutouts(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShoutouts();
  }, []);

  const handleCreate = async (payload) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Create failed");
      await fetchShoutouts();
      setEditing(null);
    } catch (err) {
      alert("Create failed: " + err.message);
    }
  };

  const handleUpdate = async (id, payload) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Update failed");
      await fetchShoutouts();
      setEditing(null);
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      await fetchShoutouts();
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  return (
    <div className="container py-4">
      <h1 className="display-5 mb-3 brand-title">Shoutouts</h1>

      <div className="row">
        <div className="col-lg-5 mb-3">
          <div className="card p-3 bg-gradient-left shadow-sm">
            <h5 className="mb-3 text-white">Create / Edit Shoutout</h5>
            <ShoutoutForm
              initial={editing || {}}
              onSubmit={async (payload) => {
                if (editing && editing.id) {
                  await handleUpdate(editing.id, payload);
                } else {
                  await handleCreate(payload);
                }
              }}
              onCancel={() => setEditing(null)}
            />
          </div>
        </div>

        <div className="col-lg-7">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">All Shoutouts</h4>
            <div>
              <button className="btn btn-sm btn-outline-secondary" onClick={fetchShoutouts}>
                Refresh
              </button>
            </div>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {loading && <div className="text-muted">Loading...</div>}

          {shoutouts.length === 0 && !loading && (
            <div className="text-muted">No shoutouts yet — be the first!</div>
          )}

          {shoutouts.map((s) => (
            <ShoutoutCard key={s.id} data={s} onEdit={setEditing} onDelete={handleDelete} />
          ))}
        </div>
      </div>
    </div>
  );
}
