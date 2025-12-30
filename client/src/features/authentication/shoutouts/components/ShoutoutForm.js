import React, { useState, useEffect } from "react";


export default function ShoutoutForm({ initial = {}, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initial.title || "");
  const [message, setMessage] = useState(initial.message || "");
  const [senderId, setSenderId] = useState(initial.sender_id ?? "");
  const [receiverId, setReceiverId] = useState(initial.receiver_id ?? "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(initial.title || "");
    setMessage(initial.message || "");
    setSenderId(initial.sender_id ?? "");
    setReceiverId(initial.receiver_id ?? "");
  }, [initial]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !message || !senderId || !receiverId) {
      alert("Please fill all fields");
      return;
    }
    setLoading(true);
    await onSubmit({
      title,
      message,
      sender_id: Number(senderId),
      receiver_id: Number(receiverId),
    });
    setLoading(false);
  };

  return (
    <form className="card p-3 shadow-sm shoutout-form" onSubmit={handleSubmit}>
      <div className="d-flex gap-2 mb-2">
        <input
          className="form-control"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="form-control"
          placeholder="Sender ID"
          value={senderId}
          onChange={(e) => setSenderId(e.target.value)}
        />
        <input
          className="form-control"
          placeholder="Receiver ID"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <textarea
          className="form-control"
          rows={3}
          placeholder="Write shoutout message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <div className="d-flex justify-content-end gap-2">
        {onCancel && (
          <button type="button" className="btn btn-light" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary">
          {loading ? "Saving..." : "Save Shoutout"}
        </button>
      </div>
    </form>
  );
}
