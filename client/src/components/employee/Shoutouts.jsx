import React, { useState } from "react";

const EMPLOYEES = [
  { id: 1, name: "Rani", avatar: "🧑‍🎨" },
  { id: 2, name: "Raj", avatar: "👨‍💼" },
  { id: 3, name: "Shan", avatar: "👨‍💻" },
  { id: 4, name: "Akshay", avatar: "👨‍🔬" }
];

// Placeholder for received shoutouts
const RECEIVED = [
  { from: "Rani", avatar: "🧑‍🎨", message: "You played a vital role in the success of the project" },
  { from: "Raj", avatar: "👨‍💼", message: "You played a vital role in the success of the project" }
];

function Shoutouts() {
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("");
  const [visibility, setVisibility] = useState("Public");
  const [myShoutouts, setMyShoutouts] = useState([
    { to: "Shan", msg: "Great job on the report!", date: "20 Oct 2025", status: "Approved" },
    { to: "Akshay", msg: "Thank you for helping with the UI!", date: "15 Oct 2025", status: "Pending" }
  ]);

  // Handle submit of new shoutout
  function handleSubmit(e) {
    e.preventDefault();
    if (!recipient || !message) return;
    setMyShoutouts([
      ...myShoutouts,
      { to: recipient, msg: message, date: new Date().toLocaleDateString(), status: "Pending" }
    ]);
    setRecipient(""); setMessage(""); setCategory("");
  }

  return (
    <div style={{ padding: "32px 32px 32px 0", display: "flex", gap: "20px" , color: "#333333"}}>
      <div style={{ flex: 2 }}>
        <h2>Employee Shoutouts</h2>
        <form onSubmit={handleSubmit}>
          <h3>Create New Shoutout</h3>
          <select
            value={recipient}
            onChange={e => setRecipient(e.target.value)}
            style={{
              width: "100%", padding: "10px", marginBottom: "18px", marginTop: "12px", borderRadius: "8px"
            }}
          >
            <option value="">Select Recipient(s)</option>
            {EMPLOYEES.map(e => (
              <option key={e.id} value={e.name}>{e.name}</option>
            ))}
          </select>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Message"
            rows={3}
            style={{
              width: "100%", padding: "12px", borderRadius: "8px", marginBottom: "18px"
            }}
          />
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{
              width: "100%", padding: "10px", marginBottom: "18px", borderRadius: "8px"
            }}>
            <option value="">Category</option>
            <option value="Teamwork">Teamwork</option>
            <option value="Innovation">Innovation</option>
            <option value="Leadership">Leadership</option>
          </select>
          <div style={{ marginBottom: "16px" }}>
            <label>
              <input
                type="radio" value="Public"
                checked={visibility === "Public"}
                onChange={e => setVisibility(e.target.value)}
              /> Public
            </label>
            {"   "}
            <label>
              <input
                type="radio" value="Private"
                checked={visibility === "Private"}
                onChange={e => setVisibility(e.target.value)}
              /> Private
            </label>
          </div>
          {/* Image upload can be mocked for now */}
          <button type="submit" style={{ padding: "10px 25px", background: "#8559d6", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 500 }}>Send Shoutout</button>
        </form>

        <h4 style={{ marginTop: "36px" }}>My Shoutouts</h4>
        <table style={{ width: "100%", marginTop: "10px", background: "#fafafa", borderRadius: "10px" }}>
          <thead>
            <tr style={{ color: "#8559d6" }}>
              <th>Recipient</th>
              <th>Message</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {myShoutouts.map((s, idx) => (
              <tr key={idx}>
                <td>{s.to}</td>
                <td>{s.msg}</td>
                <td>{s.date}</td>
                <td style={{ color: s.status === "Approved" ? "#0e9b44" : "#efb300" }}>{s.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Received Shoutouts */}
      <div style={{ flex: 1, background: "#ececec", borderRadius: "10px", padding: "18px" }}>
        <h4>Received Shoutouts</h4>
        {RECEIVED.map((r, i) => (
          <div key={i} style={{ marginBottom: "22px", display: "flex", alignItems: "center" }}>
            <span style={{
              fontSize: "2.1em", marginRight: "9px"
            }}>{r.avatar}</span>
            <div>
              <strong>{r.from}</strong>
              <div>{r.message}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Shoutouts;
