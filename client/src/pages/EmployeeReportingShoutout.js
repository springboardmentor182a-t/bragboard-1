import { useEffect, useState } from "react";
import axios from "axios";
import "../index.css";

const API = "http://127.0.0.1:8000/shoutouts";

export default function EmployeeReportingShoutout() {
  const [reason, setReason] = useState("");
  const [shoutouts, setShoutouts] = useState([]);
  const [selectedShoutoutId, setSelectedShoutoutId] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("access_token"); // employee JWT

  // --- Submit a report ---
  const submitReport = async () => {
    if (!reason || !selectedShoutoutId) {
      setError("Please enter Shoutout ID and reason.");
      return;
    }

    if (!token) {
      setError("You must be logged in to report a shoutout.");
      return;
    }

    try {
      await axios.post(
        `${API}/shoutout/${selectedShoutoutId}`,
        { reason }, // backend schema: ReportCreate
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Reset form
      setReason("");
      setSelectedShoutoutId("");
      setError("");

      // Reload reports
      loadMyReports();
    } catch (err) {
      console.error("Failed to submit report", err);
      setError("Failed to submit report. Please try again.");
    }
  };

  // --- Load employee's own reports ---
  const loadMyReports = async () => {
    if (!token) return;

    try {
      const res = await axios.get(`${API}/me`, {
        headers: { Authorization: `Bearer ${token}` }, // ⚡ FIX: use token
      });
      setShoutouts(res.data);
    } catch (err) {
      console.error("Failed to load reports", err);
      setError("Failed to load your reports.");
    }
  };

  useEffect(() => {
    loadMyReports();
  }, []);

  return (
    <div className="EmployeeReportingShoutout">
      <div className="container">
        <h1>Report a Shoutout</h1>

        {error && <p className="error-message">{error}</p>}

        <div className="form-card">
          <input
            type="text"
            placeholder="Shoutout ID"
            value={selectedShoutoutId}
            onChange={(e) => setSelectedShoutoutId(e.target.value)}
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

        <div className="section-title">My Reported Shoutouts</div>
        {shoutouts.length === 0 && <p>No reports submitted yet.</p>}

        {shoutouts.map((s) => (
          <div className="shoutout-card" key={s.id}>
            <p>
              <strong>Shoutout ID:</strong> {s.shoutout_id}
            </p>
            <p>
              <strong>Reason:</strong> {s.reason}
            </p>
            <span className={`status ${s.status}`}>{s.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
