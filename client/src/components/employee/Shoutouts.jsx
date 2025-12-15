import React, { useEffect, useState } from "react";
import { getJson, postJson } from "../../api.js";
import {
  EMPLOYEES,
  SHOUTOUTS as STATIC_SHOUTOUTS,
  getEmployeeName,
} from "../../data/constants";

const CURRENT_USER_ID = 1; // mock logged-in employee (Alice Johnson)
const CATEGORIES = ["Teamwork", "Leadership", "Creativity", "Support", "Extra Mile"];

export default function Shoutouts() {
  const [list, setList] = useState([]);
  const [allShoutouts, setAllShoutouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("mine"); // "mine" | "all"

  // form state
  const [recipients, setRecipients] = useState([]);
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);
  // comments UI state
  const [commentsByShoutout, setCommentsByShoutout] = useState({});
  const [newComment, setNewComment] = useState({});

  useEffect(() => {
    loadShoutouts();
  }, []);

  const loadShoutouts = async () => {
    try {
      setLoading(true);
      const data = await getJson("/shoutouts");
      const apiList = data || [];

      if (apiList.length > 0) {
        // Backend already returns full objects; keep as-is
        setAllShoutouts(apiList);
      } else {
        // Fallback to static constants
        const mapped = STATIC_SHOUTOUTS.map((s) => ({
          id: s.id,
          sender_id: s.from,
          receiver_id: s.to,
          sender_name: getEmployeeName(s.from),
          receiver_name: getEmployeeName(s.to),
          name: getEmployeeName(s.to),
          message: s.reason,
          reactions: { like: s.reactionsCount },
        }));
        setAllShoutouts(mapped);
      }
    } catch (err) {
      console.error("Failed to load shoutouts:", err);
      const mapped = STATIC_SHOUTOUTS.map((s) => ({
        id: s.id,
        sender_id: s.from,
        receiver_id: s.to,
        sender_name: getEmployeeName(s.from),
        receiver_name: getEmployeeName(s.to),
        name: getEmployeeName(s.to),
        message: s.reason,
        reactions: { like: s.reactionsCount },
      }));
      setAllShoutouts(mapped);
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
      const name = recipients.join(", ");
      await postJson("/shoutouts", { name, message });
      setRecipients([]);
      setMessage("");
      await loadShoutouts();
    } catch (err) {
      console.error("Failed to post shoutout:", err);
      alert("Failed to post shoutout. See console for details.");
    }
  };

const reactTo = (id, type) => {
  setAllShoutouts((prev) =>
    prev.map((s) => {
      if (s.id !== id) return s;
      const current = s.reactions || {};
      return {
        ...s,
        reactions: {
          ...current,
          [type]: (current[type] || 0) + 1,
        },
      };
    })
  );
};


  // visible list based on filter
  const list =
    filter === "mine"
      ? allShoutouts.filter((s) => s.sender_id === CURRENT_USER_ID)
      : allShoutouts;

  const received = allShoutouts
  .filter((s) => s.receiver_id === CURRENT_USER_ID) // only shoutouts TO this employee
  .slice(-3)
  .reverse();

  // comments helpers
  const handleCommentChange = (id, value) => {
    setNewComment((prev) => ({ ...prev, [id]: value }));
  };

  const addComment = (id) => {
    const text = (newComment[id] || "").trim();
    if (!text) return;
    setCommentsByShoutout((prev) => ({
      ...prev,
      [id]: [...(prev[id] || []), text],
    }));
    setNewComment((prev) => ({ ...prev, [id]: "" }));
  };

  const removeComment = (id, index) => {
    setCommentsByShoutout((prev) => {
      const arr = [...(prev[id] || [])];
      arr.splice(index, 1);
      return { ...prev, [id]: arr };
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-start justify-center p-6">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left pane: create + my/all shoutouts */}
        <div className="md:col-span-2 space-y-6">
          {/* Create new shoutout */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100">
            <h2 className="text-xl font-semibold mb-4">Employee Shoutouts</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Recipients from constants EMPLOYEES */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Select Recipient(s)
                </label>
                <div className="flex flex-wrap gap-2">
                  {EMPLOYEES.map((emp) => {
                    const active = recipients.includes(emp.name);
                    return (
                      <button
                        key={emp.id}
                        type="button"
                        onClick={() => toggleRecipient(emp.name)}
                        className={
                          "px-3 py-1 rounded-full text-sm border " +
                          (active
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-slate-100 text-slate-700 border-transparent")
                        }
                      >
                        {emp.name}
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

              <button
                type="submit"
                className="w-full mt-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-2xl font-semibold shadow-md hover:shadow-lg"
              >
                Post Shoutout 🚀
              </button>
            </form>
          </div>
          {/* My / All Shoutouts list */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">
                {filter === "mine" ? "My Shoutouts" : "All Shoutouts"}
              </h3>
              <div className="flex gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setFilter("mine")}
                  className={
                    "px-3 py-1 rounded-full border " +
                    (filter === "mine"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-slate-100 text-slate-700 border-slate-200")
                  }
                >
                  My
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className={
                    "px-3 py-1 rounded-full border " +
                    (filter === "all"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-slate-100 text-slate-700 border-slate-200")
                  }
                >
                  All
                </button>
              </div>
            </div>
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
                      <span className="font-medium">
                        {s.sender_name ||
                          (s.sender_id && getEmployeeName(s.sender_id)) ||
                          "Someone"}
                      </span>{" "}
                      gave a shout-out to{" "}
                      <span className="font-medium">
                        {s.receiver_name ||
                          s.name ||
                          (s.receiver_id && getEmployeeName(s.receiver_id))}
                      </span>
                    </div>

                    <div className="text-slate-800 text-sm">{s.message}</div>
                    {/* Reactions UI */}
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
                    {/* Comments UI */}
                    <div className="mt-3 border-t border-slate-100 pt-3">
                      <h4 className="text-sm font-semibold mb-2">Comments</h4>

                      <div className="space-y-1 mb-2">
                        {(commentsByShoutout[s.id] || []).map((c, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-xs bg-slate-50 rounded-xl px-3 py-1"
                          >
                            <span>{c}</span>
                            <button
                              type="button"
                              className="text-[10px] text-red-500 hover:underline"
                              onClick={() => removeComment(s.id, idx)}
                            >
                              remove
                            </button>
                          </div>
                        ))}
                        {(!commentsByShoutout[s.id] ||
                          commentsByShoutout[s.id].length === 0) && (
                          <p className="text-xs text-slate-400">
                            No comments yet.
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="flex-1 border rounded-xl px-3 py-1 text-xs bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-400"
                          placeholder="Add a comment..."
                          value={newComment[s.id] || ""}
                          onChange={(e) =>
                            handleCommentChange(s.id, e.target.value)
                          }
                        />
                        <button
                          type="button"
                          onClick={() => addComment(s.id)}
                          className="px-3 py-1 rounded-xl text-xs bg-blue-600 text-white hover:bg-blue-700"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/* Right pane: recent received shoutouts */}
<div className="space-y-4">
  <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100 h-full">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-lg font-semibold">Received Shoutouts</h3>
      <span className="text-xs text-slate-500 cursor-pointer">All</span>
    </div>

    {received.length === 0 ? (
      <p className="text-sm text-slate-500">No shoutouts received yet.</p>
    ) : (
      <>
        {/* List of received shoutouts */}
        <div className="mt-3 space-y-4">
          {received.map((s) => (
            <div key={s.id} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm">
                {s.sender_name?.[0]?.toUpperCase() ||
                  s.name?.[0]?.toUpperCase() ||
                  "?"}
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">
                  {s.sender_name || s.name}
                </div>
                <div className="text-xs text-slate-600">{s.message}</div>
              </div>
            </div>
            
          ))}
        </div>

        {/* NEW: totals for reactions under received list */}
        <div className="mt-4 border-t border-slate-100 pt-3">
          <h4 className="text-sm font-semibold mb-2">Received Reactions</h4>
          <div className="flex gap-4 text-xs text-slate-600">
            <span>
              👍{" "}
              {received.reduce(
                (sum, s) => sum + (s.reactions?.like || 0),
                0
              )}
            </span>
            <span>
              ❤️{" "}
              {received.reduce(
                (sum, s) => sum + (s.reactions?.love || 0),
                0
              )}
            </span>
            <span>
              😂{" "}
              {received.reduce(
                (sum, s) => sum + (s.reactions?.laugh || 0),
                0
              )}
            </span>
          </div>
        </div>
      </>
    )}
  </div>
</div>
      </div>
    </div>
  );
}


