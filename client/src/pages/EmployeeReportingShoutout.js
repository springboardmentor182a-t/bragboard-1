import { useEffect, useState } from "react";
import axios from "axios";
import "../index.css";   // IMPORTANT: correct path

const API = "http://127.0.0.1:8000";

export default function EmployeeReportingShoutout() {
  const employeeId = 101;

  const [content, setContent] = useState("");
  const [reason, setReason] = useState("");
  const [shoutouts, setShoutouts] = useState([]);

  const loadShoutouts = async () => {
    try {
      const res = await axios.get(`${API}/shoutouts/${employeeId}`);
      setShoutouts(res.data);
    } catch (err) {
      console.error("Failed to load shoutouts", err);
    }
  };

  const submitReport = async () => {
    if (!content || !reason) return;

    try {
      await axios.post(`${API}/shoutouts`, {
        employee_id: employeeId,
        title: content,
        description: reason,
      });

      setContent("");
      setReason("");
      loadShoutouts();
    } catch (err) {
      console.error("Failed to submit report", err);
    }
  };

  useEffect(() => {
    loadShoutouts();
  }, []);

  return (
    <div className="container">
      <h1>Report a Shoutout</h1>

      {/* Report Form */}
      <div className="form-card">
        <input
          placeholder="Enter shoutout content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <textarea
          placeholder="Reason for reporting"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <button className="submit-btn" onClick={submitReport}>
          Submit Report
        </button>
      </div>

      {/* Reported Shoutouts */}
      <div className="section-title">My Reported Shoutouts</div>

      {shoutouts.length === 0 && (
        <p style={{ marginTop: "15px" }}>No reports submitted yet.</p>
      )}

      {shoutouts.map((s) => (
        <div className="shoutout-card" key={s.id}>
          <p><strong>Shoutout:</strong> {s.title}</p>
          <p><strong>Reason:</strong> {s.description}</p>

          <span className={`status ${s.status.toLowerCase()}`}>
            {s.status}
          </span>
        </div>
      ))}
    </div>
  );
}
