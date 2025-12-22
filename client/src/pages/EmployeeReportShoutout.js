import { useState } from "react";

function EmployeeReportShoutout() {
  const [shoutout, setShoutout] = useState("");
  const [reason, setReason] = useState("");

  const [reports, setReports] = useState([
    {
      id: 1,
      shoutout: "Great job team!",
      reason: "Spam content",
      status: "Pending",
    },
    {
      id: 2,
      shoutout: "Excellent support",
      reason: "Inappropriate language",
      status: "Resolved",
    },
  ]);

  const submitReport = () => {
    if (!shoutout || !reason) {
      alert("Please fill all fields");
      return;
    }

    const newReport = {
      id: Date.now(),
      shoutout,
      reason,
      status: "Pending",
    };

    setReports([...reports, newReport]);
    setShoutout("");
    setReason("");
  };

  return (
  <div className="page">
    <h1>Report a Shoutout</h1>

    <div className="form">
      <input
        type="text"
        placeholder="Enter shoutout content"
        value={shoutout}
        onChange={(e) => setShoutout(e.target.value)}
      />

      <textarea
        placeholder="Reason for reporting"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />

      <button onClick={submitReport}>Submit Report</button>
    </div>

    <h2>My Reported Shoutouts</h2>

    <div className="report-list">
      {reports.map((report) => (
        <div className="report-item" key={report.id}>
          <p><strong>Shoutout:</strong> {report.shoutout}</p>
          <p><strong>Reason:</strong> {report.reason}</p>
          <span className={`status ${report.status.toLowerCase()}`}>
            {report.status}
          </span>
        </div>
      ))}
    </div>
  </div>
);

}

export default EmployeeReportShoutout;
