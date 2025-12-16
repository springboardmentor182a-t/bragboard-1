import React, { useEffect, useState } from "react";
import { getJson, postJson } from "../../lib/api";

const EMPLOYEES = ["Rani", "Raj", "Shan", "Akshay", "Vaishnavi"];
const CATEGORIES = ["Teamwork", "Leadership", "Creativity", "Support", "Extra Mile"];

export default function Shoutouts() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  // form state
  const [recipients, setRecipients] = useState([]);
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadShoutouts();
  }, []);

  const loadShoutouts = async () => {
    try {
      setLoading(true);
      const data = await getJson("/shoutouts");
      setList(data || []);
    } catch (err) {
      console.error("Failed to load shoutouts:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleRecipient = (name) => {
    setRecipients((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const toggleCategory = (cat) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (recipients.length === 0) return alert("Select at least one recipient");
    try {
      // for now send one combined name string to backend
      const name = recipients.join(", ");
      await postJson("/shoutouts", { name, message });
      setRecipients([]);
      setMessage("");
      setCategories([]);
      await loadShoutouts();
    } catch (err) {
      console.error("Failed to post shoutout:", err);
    }
  };

  const reactTo = async (id, type) => {
    try {
      const updated = await postJson(`/shoutouts/${id}/reaction/${type}`, {});
      setList((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    } catch (err) {
      console.error("Reaction failed:", err);
    }
  };

  const received = list.slice(-3).reverse(); // simple “received” section

  return (
    <div className="min-h-screen bg-slate-50 flex items-start justify-center p-6">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left pane: create + my shoutouts */}
        <div className="md:col-span-2 space-y-6">
          {/* Create new shoutout */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100">
            <h2 className="text-xl font-semibold mb-4">Employee Shoutouts</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Recipients multi-select */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Select Recipient(s)
                </label>
                <div className="flex flex-wrap gap-2">
                  {EMPLOYEES.map((emp) => {
                    const active = recipients.includes(emp);
                    return (
                      <button
                        key={emp}
                        type="button"
                        onClick={() => toggleRecipient(emp)}
                        className={
                          "px-3 py-1 rounded-full text-sm border " +
                          (active
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-slate-100 text-slate-700 border-transparent")
                        }
                      >
                        {emp}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Message
                </label>
                <textarea
                  className="w-full border rounded-2xl p-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Write a kind message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              {/* Categories multi-select */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => {
                    const active = categories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={
                          "px-3 py-1 rounded-full text-xs border " +
                          (active
                            ? "bg-purple-600 text-white border-purple-600"
                            : "bg-slate-100 text-slate-700 border-transparent")
                        }
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-2xl font-semibold shadow-md hover:shadow-lg"
              >
                Post Shoutout 🚀
              </button>
            </form>
          </div>

          {/* My Shoutouts list with reactions */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100">
            <h3 className="text-lg font-semibold mb-3">My Shoutouts</h3>
            {loading && <p className="text-sm text-slate-500">Loading...</p>}
            {!loading && list.length === 0 && (
              <p className="text-sm text-slate-500">No shoutouts yet.</p>
            )}
            <div className="space-y-4">
              {list.map((s) => {
                const r = s.reactions || { like: 0, love: 0, laugh: 0 };
                return (
                  <div
                    key={s.id}
                    className="border border-slate-100 rounded-2xl p-4 flex flex-col gap-2"
                  >
                    <div className="text-sm text-slate-500">
                      Recipient(s): <span className="font-medium">{s.name}</span>
                    </div>
                    <div className="text-slate-800 text-sm">{s.message}</div>
                    <div className="flex gap-3 mt-2">
                      <button
                        onClick={() => reactTo(s.id, "like")}
                        className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-full bg-slate-100 hover:bg-blue-100"
                      >
                        👍 {r.like || 0}
                      </button>
                      <button
                        onClick={() => reactTo(s.id, "love")}
                        className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-full bg-slate-100 hover:bg-rose-100"
                      >
                        ❤️ {r.love || 0}
                      </button>
                      <button
                        onClick={() => reactTo(s.id, "laugh")}
                        className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-full bg-slate-100 hover:bg-amber-100"
                      >
                        😂 {r.laugh || 0}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right pane: received shoutouts */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100 h-full">
            <div className="flex items-center justify-between mb  -3">
              <h3 className="text-lg font-semibold">Received Shoutouts</h3>
              <span className="text-xs text-slate-500 cursor-pointer">
                All
              </span>
            </div>
            {received.length === 0 && (
              <p className="text-sm text-slate-500">No shoutouts received yet.</p>
            )}
            <div className="mt-3 space-y-4">
              {received.map((s) => (
                <div key={s.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm">
                    {s.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{s.name}</div>
                    <div className="text-xs text-slate-600">{s.message}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
