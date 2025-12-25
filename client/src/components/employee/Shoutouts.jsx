<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { getJson, postJson } from "../../lib/api";
import { EMPLOYEES, SHOUTOUTS, getEmployeeName } from "../../data/constants";

const CATEGORIES = ["Teamwork", "Leadership", "Creativity", "Support", "Extra Mile"];

export default function Shoutouts() {
  // Get current user ID from localStorage
  const CURRENT_USER_ID = parseInt(localStorage.getItem("user_id")) || 1;
  
  const [allShoutouts, setAllShoutouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("mine");

  // form state
  const [recipients, setRecipients] = useState([]);
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);

  // comments UI state
  const [commentsByShoutout, setCommentsByShoutout] = useState({});
  const [newComment, setNewComment] = useState({});

  // Debug: Log state changes
  useEffect(() => {
    console.log("Comments state updated:", commentsByShoutout);
  }, [commentsByShoutout]);

  useEffect(() => {
    loadShoutouts();
  }, []);

  const loadShoutouts = async () => {
    try {
      setLoading(true);
      const response = await getJson("/shoutouts");
      const apiList = response.data || [];

      if (apiList.length > 0) {
        const normalized = apiList.map((s) => ({
          ...s,
          sender_name: s.sender_name || getEmployeeName(s.sender_id),
          receiver_name: s.receiver_name || getEmployeeName(s.receiver_id),
          message: s.message || s.reason || s.content || "",
          reactions: s.reactions || { like: 0, love: 0, laugh: 0 },
        }));
        setAllShoutouts(normalized);
        
        for (const shoutout of normalized) {
          loadComments(shoutout.id);
          loadReactions(shoutout.id);
        }
      } else {
        const mapped = SHOUTOUTS.map((s) => ({
          id: s.id,
          sender_id: s.from,
          receiver_id: s.to,
          sender_name: getEmployeeName(s.from),
          receiver_name: getEmployeeName(s.to),
          message: s.reason,
          reactions: { like: s.reactionsCount || 0, love: 0, laugh: 0 },
        }));
        setAllShoutouts(mapped);
      }
    } catch (err) {
      console.error("Failed to load shoutouts:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleRecipient = (name) =>
    setRecipients((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );

  const toggleCategory = (cat) =>
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recipients.length) return alert("Select at least one recipient");

    try {
      const name = recipients.join(", ");
      const response = await postJson("/shoutouts", { name, message });
      setRecipients([]);
      setMessage("");
      await loadShoutouts();
    } catch (err) {
      console.error("Failed to post shoutout:", err);
    }
  };

  const reactTo = async (id, type) => {
    try {
      // Call API to toggle reaction
      const response = await postJson(`/shoutouts/${id}/reaction/${type}?user_id=${CURRENT_USER_ID}`);
      
      console.log("Reaction response:", response);
      
      // Update UI with actual counts from server
      if (response.data && response.data.counts) {
        setAllShoutouts((prev) =>
          prev.map((s) =>
            s.id !== id
              ? s
              : {
                  ...s,
                  reactions: response.data.counts,
                }
          )
        );
      }
    } catch (err) {
      console.error("Failed to add reaction:", err);
    }
  };

  const loadReactions = async (shoutoutId) => {
    try {
      const response = await getJson(`/shoutouts/${shoutoutId}/reactions`);
      console.log(`Reaction response for shoutout ${shoutoutId}:`, response);
      
      if (response.data && response.data.counts) {
        setAllShoutouts((prev) =>
          prev.map((s) =>
            s.id !== shoutoutId
              ? s
              : {
                  ...s,
                  reactions: response.data.counts,
                }
          )
        );
      } else {
        // Initialize with empty counts if no reactions yet
        setAllShoutouts((prev) =>
          prev.map((s) =>
            s.id !== shoutoutId
              ? s
              : {
                  ...s,
                  reactions: { like: 0, love: 0, laugh: 0 },
                }
          )
        );
      }
    } catch (err) {
      console.error("Failed to load reactions:", err);
    }
  };

  const loadComments = async (shoutoutId) => {
    try {
      const response = await getJson(`/shoutouts/${shoutoutId}/comments`);
      const comments = response.data;
      console.log(`Loaded comments for shoutout ${shoutoutId}:`, comments);
      console.log(`Is array?`, Array.isArray(comments));
      
      // Ensure comments is always an array
      const commentsArray = Array.isArray(comments) ? comments : [];
      
      setCommentsByShoutout((prev) => ({
        ...prev,
        [shoutoutId]: commentsArray,
      }));
    } catch (err) {
      console.error("Failed to load comments:", err);
      // Set empty array on error
      setCommentsByShoutout((prev) => ({
        ...prev,
        [shoutoutId]: [],
      }));
    }
  };

  const handleCommentChange = (id, value) =>
    setNewComment((prev) => ({ ...prev, [id]: value }));

  const addComment = async (id) => {
    const text = (newComment[id] || "").trim();
    if (!text) return;
    
    try {
      const response = await postJson(`/shoutouts/${id}/comments`, {
        content: text,
        user_id: CURRENT_USER_ID,
      });
      
      console.log("Comment added response:", response);
      console.log("Current comments for shoutout:", commentsByShoutout[id]);
      
      // Clear input first
      setNewComment((prev) => ({ ...prev, [id]: "" }));
      
      // Reload comments from server to ensure sync
      await loadComments(id);
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const removeComment = async (shoutoutId, commentId) => {
    try {
      // Call API to delete comment
      await fetch(`http://localhost:8000/shoutouts/comments/${commentId}?user_id=${CURRENT_USER_ID}`, {
        method: "DELETE",
      });
      
      // Update UI
      setCommentsByShoutout((prev) => ({
        ...prev,
        [shoutoutId]: (prev[shoutoutId] || []).filter((c) => c.id !== commentId),
      }));
    } catch (err) {
      console.error("Failed to remove comment:", err);
    }
  };

  // filtered shoutouts
  const visibleList =
    filter === "mine"
      ? allShoutouts.filter((s) => s.sender_id === CURRENT_USER_ID)
      : allShoutouts;

  const received = allShoutouts
    .filter((s) => s.receiver_id === CURRENT_USER_ID)
    .slice(-3)
    .reverse();

  return (
    <div className="min-h-screen bg-slate-50 flex items-start justify-center p-6">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left pane */}
        <div className="md:col-span-2 space-y-6">
          {/* Create shoutout */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100">
            <h2 className="text-xl font-semibold mb-4">Employee Shoutouts</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Recipients */}
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

              {/* Categories */}
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
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

          {/* Shoutouts list */}
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
            {!loading && visibleList.length === 0 && (
              <p className="text-sm text-slate-500">No shoutouts yet.</p>
            )}

            <div className="space-y-4">
              {visibleList.map((s) => (
                <div
                  key={s.id}
                  className="border border-slate-100 rounded-2xl p-4 flex flex-col gap-2"
                >
                  <div className="text-sm text-slate-500">
                    <span className="font-medium">{s.sender_name || "Someone"}</span>{" "}
                    gave a shout-out to{" "}
                    <span className="font-medium">{s.receiver_name || "Someone"}</span>
                  </div>

                  <div className="text-slate-800 text-sm">{s.message}</div>

                  {/* Reactions */}
                  <div className="flex gap-3 mt-2">
                    {["like", "love", "laugh"].map((type) => (
                      <button
                        key={type}
                        onClick={() => reactTo(s.id, type)}
                        className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-full bg-slate-100 hover:bg-blue-100"
                      >
                        {type === "like" ? "👍" : type === "love" ? "❤️" : "😂"}{" "}
                        {s.reactions?.[type] || 0}
                      </button>
                    ))}
                  </div>

                  {/* Comments */}
                  <div className="mt-3 border-t border-slate-100 pt-3">
                    <h4 className="text-sm font-semibold mb-2">Comments</h4>
                    <div className="space-y-1 mb-2">
                      {Array.isArray(commentsByShoutout[s.id]) && commentsByShoutout[s.id].map((c) => (
                        <div
                          key={c.id}
                          className="flex items-center justify-between text-xs bg-slate-50 rounded-xl px-3 py-1"
                        >
                          <span>{c.content}</span>
                          {c.user_id === CURRENT_USER_ID && (
                            <button
                              type="button"
                              className="text-[10px] text-red-500 hover:underline"
                              onClick={() => removeComment(s.id, c.id)}
                            >
                              remove
                            </button>
                          )}
                        </div>
                      ))}
                      {(!Array.isArray(commentsByShoutout[s.id]) || commentsByShoutout[s.id].length === 0) && (
                        <p className="text-xs text-slate-400">No comments yet.</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 border rounded-xl px-3 py-1 text-xs bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        placeholder="Add a comment..."
                        value={newComment[s.id] || ""}
                        onChange={(e) => handleCommentChange(s.id, e.target.value)}
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
              ))}
            </div>
          </div>
        </div>

        {/* Right pane: received shoutouts */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100 h-full">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Received Shoutouts</h3>
              <span className="text-xs text-slate-500 cursor-pointer">All</span>
            </div>
            {received.length === 0 ? (
              <p className="text-sm text-slate-500">No shoutouts received yet.</p>
            ) : (
              <div className="mt-3 space-y-4">
                {received.map((s) => (
                  <div key={s.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm">
                      {s.sender_name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{s.sender_name}</div>
                      <div className="text-xs text-slate-600">{s.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Totals for reactions */}
            <div className="mt-4 border-t border-slate-100 pt-3">
              <h4 className="text-sm font-semibold mb-2">Received Reactions</h4>
              <div className="flex gap-4 text-xs text-slate-600">
                <span>👍 {received.reduce((sum, s) => sum + (s.reactions?.like || 0), 0)}</span>
                <span>❤️ {received.reduce((sum, s) => sum + (s.reactions?.love || 0), 0)}</span>
                <span>😂 {received.reduce((sum, s) => sum + (s.reactions?.laugh || 0), 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
=======
import React, { useEffect, useState } from "react";
import { getJson, postJson } from "../../lib/api";
import { EMPLOYEES, SHOUTOUTS, getEmployeeName } from "../../data/constants";

const CATEGORIES = ["Teamwork", "Leadership", "Creativity", "Support", "Extra Mile"];

export default function Shoutouts() {
  // Get current user ID from localStorage
  const CURRENT_USER_ID = parseInt(localStorage.getItem("user_id")) || 1;
  
  const [allShoutouts, setAllShoutouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("mine");

  // form state
  const [recipients, setRecipients] = useState([]);
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);

  // comments UI state
  const [commentsByShoutout, setCommentsByShoutout] = useState({});
  const [newComment, setNewComment] = useState({});

  // Debug: Log state changes
  useEffect(() => {
    console.log("Comments state updated:", commentsByShoutout);
  }, [commentsByShoutout]);

  useEffect(() => {
    loadShoutouts();
  }, []);

  const loadShoutouts = async () => {
    try {
      setLoading(true);
      const response = await getJson("/shoutouts");
      const apiList = response.data || [];

      if (apiList.length > 0) {
        const normalized = apiList.map((s) => ({
          ...s,
          sender_name: s.sender_name || getEmployeeName(s.sender_id),
          receiver_name: s.receiver_name || getEmployeeName(s.receiver_id),
          message: s.message || s.reason || s.content || "",
          reactions: s.reactions || { like: 0, love: 0, laugh: 0 },
        }));
        setAllShoutouts(normalized);
        
        for (const shoutout of normalized) {
          loadComments(shoutout.id);
          loadReactions(shoutout.id);
        }
      } else {
        const mapped = SHOUTOUTS.map((s) => ({
          id: s.id,
          sender_id: s.from,
          receiver_id: s.to,
          sender_name: getEmployeeName(s.from),
          receiver_name: getEmployeeName(s.to),
          message: s.reason,
          reactions: { like: s.reactionsCount || 0, love: 0, laugh: 0 },
        }));
        setAllShoutouts(mapped);
      }
    } catch (err) {
      console.error("Failed to load shoutouts:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleRecipient = (name) =>
    setRecipients((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );

  const toggleCategory = (cat) =>
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recipients.length) return alert("Select at least one recipient");

    try {
      const name = recipients.join(", ");
      const response = await postJson("/shoutouts", { name, message });
      setRecipients([]);
      setMessage("");
      await loadShoutouts();
    } catch (err) {
      console.error("Failed to post shoutout:", err);
    }
  };

  const reactTo = async (id, type) => {
    try {
      // Call API to toggle reaction
      const response = await postJson(`/shoutouts/${id}/reaction/${type}?user_id=${CURRENT_USER_ID}`);
      
      console.log("Reaction response:", response);
      
      // Update UI with actual counts from server
      if (response.data && response.data.counts) {
        setAllShoutouts((prev) =>
          prev.map((s) =>
            s.id !== id
              ? s
              : {
                  ...s,
                  reactions: response.data.counts,
                }
          )
        );
      }
    } catch (err) {
      console.error("Failed to add reaction:", err);
    }
  };

  const loadReactions = async (shoutoutId) => {
    try {
      const response = await getJson(`/shoutouts/${shoutoutId}/reactions`);
      console.log(`Reaction response for shoutout ${shoutoutId}:`, response);
      
      if (response.data && response.data.counts) {
        setAllShoutouts((prev) =>
          prev.map((s) =>
            s.id !== shoutoutId
              ? s
              : {
                  ...s,
                  reactions: response.data.counts,
                }
          )
        );
      } else {
        // Initialize with empty counts if no reactions yet
        setAllShoutouts((prev) =>
          prev.map((s) =>
            s.id !== shoutoutId
              ? s
              : {
                  ...s,
                  reactions: { like: 0, love: 0, laugh: 0 },
                }
          )
        );
      }
    } catch (err) {
      console.error("Failed to load reactions:", err);
    }
  };

  const loadComments = async (shoutoutId) => {
    try {
      const response = await getJson(`/shoutouts/${shoutoutId}/comments`);
      const comments = response.data;
      console.log(`Loaded comments for shoutout ${shoutoutId}:`, comments);
      console.log(`Is array?`, Array.isArray(comments));
      
      // Ensure comments is always an array
      const commentsArray = Array.isArray(comments) ? comments : [];
      
      setCommentsByShoutout((prev) => ({
        ...prev,
        [shoutoutId]: commentsArray,
      }));
    } catch (err) {
      console.error("Failed to load comments:", err);
      // Set empty array on error
      setCommentsByShoutout((prev) => ({
        ...prev,
        [shoutoutId]: [],
      }));
    }
  };

  const handleCommentChange = (id, value) =>
    setNewComment((prev) => ({ ...prev, [id]: value }));

  const addComment = async (id) => {
    const text = (newComment[id] || "").trim();
    if (!text) return;
    
    try {
      const response = await postJson(`/shoutouts/${id}/comments`, {
        content: text,
        user_id: CURRENT_USER_ID,
      });
      
      console.log("Comment added response:", response);
      console.log("Current comments for shoutout:", commentsByShoutout[id]);
      
      // Clear input first
      setNewComment((prev) => ({ ...prev, [id]: "" }));
      
      // Reload comments from server to ensure sync
      await loadComments(id);
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const removeComment = async (shoutoutId, commentId) => {
    try {
      // Call API to delete comment
      await fetch(`http://localhost:8000/shoutouts/comments/${commentId}?user_id=${CURRENT_USER_ID}`, {
        method: "DELETE",
      });
      
      // Update UI
      setCommentsByShoutout((prev) => ({
        ...prev,
        [shoutoutId]: (prev[shoutoutId] || []).filter((c) => c.id !== commentId),
      }));
    } catch (err) {
      console.error("Failed to remove comment:", err);
    }
  };

  // filtered shoutouts
  const visibleList =
    filter === "mine"
      ? allShoutouts.filter((s) => s.sender_id === CURRENT_USER_ID)
      : allShoutouts;

  const received = allShoutouts
    .filter((s) => s.receiver_id === CURRENT_USER_ID)
    .slice(-3)
    .reverse();

  return (
    <div className="min-h-screen bg-slate-50 flex items-start justify-center p-6">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left pane */}
        <div className="md:col-span-2 space-y-6">
          {/* Create shoutout */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100">
            <h2 className="text-xl font-semibold mb-4">Employee Shoutouts</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Recipients */}
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

              {/* Categories */}
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
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

          {/* Shoutouts list */}
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
            {!loading && visibleList.length === 0 && (
              <p className="text-sm text-slate-500">No shoutouts yet.</p>
            )}

            <div className="space-y-4">
              {visibleList.map((s) => (
                <div
                  key={s.id}
                  className="border border-slate-100 rounded-2xl p-4 flex flex-col gap-2"
                >
                  <div className="text-sm text-slate-500">
                    <span className="font-medium">{s.sender_name || "Someone"}</span>{" "}
                    gave a shout-out to{" "}
                    <span className="font-medium">{s.receiver_name || "Someone"}</span>
                  </div>

                  <div className="text-slate-800 text-sm">{s.message}</div>

                  {/* Reactions */}
                  <div className="flex gap-3 mt-2">
                    {["like", "love", "laugh"].map((type) => (
                      <button
                        key={type}
                        onClick={() => reactTo(s.id, type)}
                        className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-full bg-slate-100 hover:bg-blue-100"
                      >
                        {type === "like" ? "👍" : type === "love" ? "❤️" : "😂"}{" "}
                        {s.reactions?.[type] || 0}
                      </button>
                    ))}
                  </div>

                  {/* Comments */}
                  <div className="mt-3 border-t border-slate-100 pt-3">
                    <h4 className="text-sm font-semibold mb-2">Comments</h4>
                    <div className="space-y-1 mb-2">
                      {Array.isArray(commentsByShoutout[s.id]) && commentsByShoutout[s.id].map((c) => (
                        <div
                          key={c.id}
                          className="flex items-center justify-between text-xs bg-slate-50 rounded-xl px-3 py-1"
                        >
                          <span>{c.content}</span>
                          {c.user_id === CURRENT_USER_ID && (
                            <button
                              type="button"
                              className="text-[10px] text-red-500 hover:underline"
                              onClick={() => removeComment(s.id, c.id)}
                            >
                              remove
                            </button>
                          )}
                        </div>
                      ))}
                      {(!Array.isArray(commentsByShoutout[s.id]) || commentsByShoutout[s.id].length === 0) && (
                        <p className="text-xs text-slate-400">No comments yet.</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 border rounded-xl px-3 py-1 text-xs bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        placeholder="Add a comment..."
                        value={newComment[s.id] || ""}
                        onChange={(e) => handleCommentChange(s.id, e.target.value)}
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
              ))}
            </div>
          </div>
        </div>

        {/* Right pane: received shoutouts */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100 h-full">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Received Shoutouts</h3>
              <span className="text-xs text-slate-500 cursor-pointer">All</span>
            </div>
            {received.length === 0 ? (
              <p className="text-sm text-slate-500">No shoutouts received yet.</p>
            ) : (
              <div className="mt-3 space-y-4">
                {received.map((s) => (
                  <div key={s.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm">
                      {s.sender_name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{s.sender_name}</div>
                      <div className="text-xs text-slate-600">{s.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Totals for reactions */}
            <div className="mt-4 border-t border-slate-100 pt-3">
              <h4 className="text-sm font-semibold mb-2">Received Reactions</h4>
              <div className="flex gap-4 text-xs text-slate-600">
                <span>👍 {received.reduce((sum, s) => sum + (s.reactions?.like || 0), 0)}</span>
                <span>❤️ {received.reduce((sum, s) => sum + (s.reactions?.love || 0), 0)}</span>
                <span>😂 {received.reduce((sum, s) => sum + (s.reactions?.laugh || 0), 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
>>>>>>> 3e2424c214281832d92a15cbeb86496329d2c772
