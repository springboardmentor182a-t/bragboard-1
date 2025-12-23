// src/components/Common/ShoutOuts.jsx
import { useState, useEffect } from "react";
import { SHOUTOUTS, getEmployeeName } from "../../data/constants";

/* Delete confirmation with both options */
function DeleteConfirmModal({ isOpen, onClose, shoutoutId, onSoftDelete, onHardDelete }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="max-w-sm w-full rounded-xl bg-white shadow-2xl p-6">
        <h3 className="mt-2 text-lg font-semibold text-center text-slate-900">
          Delete shout-out
        </h3>

        <p className="mt-2 text-sm text-center text-slate-500">
          Choose what you want to do with this shout-out.
        </p>

        <ul className="mt-4 text-xs text-slate-500 space-y-1">
          <li><span className="font-semibold text-slate-700">Move to Trash</span> – you can restore it later.</li>
          <li><span className="font-semibold text-red-700">Delete Permanently</span> – this cannot be undone.</li>
        </ul>

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onSoftDelete(shoutoutId)}
            className="px-3 py-1.5 rounded-lg bg-amber-500 text-sm text-white hover:bg-amber-600"
          >
            Move to Trash
          </button>

          <button
            type="button"
            onClick={() => onHardDelete(shoutoutId)}
            className="px-3 py-1.5 rounded-lg bg-red-600 text-sm text-white hover:bg-red-700"
          >
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
}

/* Card */
function ShoutoutCard({ shoutout, isTrash, onDeleteClick, onRestore, userMap }) {
  // Use userMap if available, otherwise fall back to getEmployeeName
  const fromName = userMap[shoutout.from] || getEmployeeName(shoutout.from);
  const toName = userMap[shoutout.to] || getEmployeeName(shoutout.to);
  const initials = toName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article
      className={`relative flex gap-4 rounded-xl border px-4 py-3 transition ${
        isTrash
          ? "border-orange-200 bg-orange-50/80 hover:border-orange-300 hover:bg-orange-50"
          : "border-slate-100 bg-slate-50 hover:border-indigo-200 hover:bg-indigo-50/40"
      }`}
    >
      {/* Buttons */}
      <div className="absolute top-2 right-2 flex gap-1">
        {isTrash ? (
          <>
            <button
              onClick={() => onRestore(shoutout.id)}
              className="text-xs bg-green-600 text-white px-2 py-1 rounded-md hover:bg-green-700 shadow-sm"
            >
              Restore
            </button>
            <button
              onClick={() => onDeleteClick(shoutout.id, true)}
              className="text-xs bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700 shadow-sm"
            >
              Delete
            </button>
          </>
        ) : (
          <button
            onClick={() => onDeleteClick(shoutout.id, false)}
            className="text-xs bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 shadow-sm"
          >
            Delete
          </button>
        )}
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center gap-1 pt-2">
        <div className="relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white text-sm font-semibold shadow-sm">
            {initials}
          </div>
          <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-white flex items-center justify-center text-xs shadow">
            {shoutout.emoji}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 py-2">
        <p className="text-sm text-slate-900">
          <span className="font-semibold">{fromName}</span>
          <span className="text-slate-400"> gave a shout-out to </span>
          <span className="font-semibold">{toName}</span>
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Reason: {shoutout.reason}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px]">
          <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 font-medium text-indigo-700">
            #{shoutout.tag}
          </span>
          <span className="text-slate-400">
            {new Date(shoutout.createdAt).toLocaleDateString()}
          </span>
          {isTrash && shoutout.deletedAt && (
            <span className="inline-flex items-center rounded-full bg-orange-50 px-2 py-0.5 font-medium text-orange-700 text-xs">
              Trashed • {new Date(shoutout.deletedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

function ShoutoutsPage() {
  const [activeTab, setActiveTab] = useState("active"); // 'active' | 'trash'
  const [confirmData, setConfirmData] = useState(null); // {id, fromTrash:boolean}
  const [items, setItems] = useState([]);
  const [userMap, setUserMap] = useState({}); // Map of user_id -> user name

  useEffect(() => {
    (async function load() {
      try {
        const token = localStorage.getItem("access_token");
        
        // First, fetch all users to create a mapping
        let allUsers = [];
        try {
          const usersRes = await fetch("http://127.0.0.1:8000/admin/users", {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });
          if (usersRes.ok) {
            allUsers = await usersRes.json();
          }
        } catch (e) {
          console.warn("Could not fetch users", e);
        }

        // Create user ID to name mapping
        const mapping = {};
        allUsers.forEach(u => {
          mapping[u.id] = u.name || u.email || "Unknown User";
        });
        setUserMap(mapping);

        // Now fetch shoutouts
        const res = await fetch("http://127.0.0.1:8000/admin/shoutouts/?page=1&page_size=200&include_deleted=true", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error(`status=${res.status}`);
        const data = await res.json();
        // ensure consistent fields across static fallback and API
        const mapped = (Array.isArray(data) ? data : []).map((s) => ({
          id: s.id,
          emoji: s.emoji || "👏",
          from: s.sender_id || s.from,
          to: s.receiver_id || s.to,
          reason: s.message || s.reason,
          tag: s.tag || "General",
          createdAt: s.created_at || s.createdAt,
          deletedAt: s.deleted_at || s.deletedAt || null,
        }));
        const sorted = mapped.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setItems(sorted);
      } catch (e) {
        console.warn("Admin shoutouts API failed, falling back to static", e);
        const sorted = [...SHOUTOUTS].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setItems(sorted);
      }
    })();
  }, []);

  const activeItems = items.filter((i) => !i.deletedAt);
  const trashItems = items.filter((i) => i.deletedAt);
  const currentItems = activeTab === "active" ? activeItems : trashItems;

  // When user clicks "Delete" button on card → open modal
  const handleDeleteClick = (id, fromTrash) => {
    setConfirmData({ id, fromTrash });
  };

  // Move to trash (soft delete)
  const softDelete = async (id) => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(
        `http://127.0.0.1:8000/admin/shoutouts/${id}/soft`,
        { 
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        console.error("Failed to soft delete", res.status);
        return;
      }
      const updatedShoutout = await res.json();
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { 
                ...item, 
                deletedAt: updatedShoutout.deleted_at || new Date().toISOString() 
              }
            : item
        )
      );
      console.log("Soft deleted shoutout:", id);
    } catch (e) {
      console.error("Soft delete error", e);
    }
    setConfirmData(null);
  };

  // Hard delete (permanent)
  const hardDelete = async (id) => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(
        `http://127.0.0.1:8000/admin/shoutouts/${id}`,
        { 
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        console.error("Failed to hard delete", res.status);
        return;
      }
      setItems((prev) => prev.filter((item) => item.id !== id));
      console.log("Hard deleted shoutout:", id);
    } catch (e) {
      console.error("Hard delete error", e);
    }
    setConfirmData(null);
  };

  // Restore from trash
  const handleRestore = async (id) => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(
        `http://127.0.0.1:8000/admin/shoutouts/${id}/restore`,
        { 
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        console.error("Failed to restore", res.status);
        return;
      }
      const restoredShoutout = await res.json();
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, deletedAt: null } : item
        )
      );
      console.log("Restored shoutout:", id);
    } catch (e) {
      console.error("Restore error", e);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header + filters + tabs */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Shout-outs</h1>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search by name or tag..."
            className="w-56 rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500"
          />
          <select className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500">
            <option value="">All Tags</option>
            <option value="Teamwork">#Teamwork</option>
            <option value="Innovation">#Innovation</option>
            <option value="Leadership">#Leadership</option>
            <option value="Support">#Support</option>
            <option value="CustomerFirst">#CustomerFirst</option>
          </select>

          <div className="flex bg-slate-100 rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setActiveTab("active")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "active"
                  ? "bg-white shadow-sm text-slate-900 border border-slate-200"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200"
              }`}
            >
              Active ({activeItems.length})
            </button>
            <button
              onClick={() => setActiveTab("trash")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "trash"
                  ? "bg-white shadow-sm text-slate-900 border border-slate-200"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200"
              }`}
            >
              Trash ({trashItems.length})
            </button>
          </div>
        </div>
      </header>

      {/* List */}
      <section className="rounded-xl bg-white shadow-sm border border-slate-200 overflow-hidden">
        <div className="space-y-3 p-6">
          {currentItems.map((s) => (
            <ShoutoutCard
              key={s.id}
              shoutout={s}
              isTrash={activeTab === "trash"}
              onDeleteClick={handleDeleteClick}
              onRestore={handleRestore}
              userMap={userMap}
            />
          ))}

          {currentItems.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-s
              
              late-100 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">
                  {activeTab === "active" ? "📭" : "🗑️"}
                </span>
              </div>
              <p className="text-sm text-slate-500 font-medium">
                {activeTab === "active"
                  ? "No shout-outs yet."
                  : "Trash is empty. Nothing has been deleted."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Modal with both options */}
      {confirmData && (
        <DeleteConfirmModal
          isOpen={true}
          shoutoutId={confirmData.id}
          onClose={() => setConfirmData(null)}
          onSoftDelete={softDelete}
          onHardDelete={hardDelete}
        />
      )}
    </div>
  );
}

export default ShoutoutsPage;
