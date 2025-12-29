import React, { useState } from "react";

const initialReports = [
  { id: 1, shoutout: "Great job team!", reportedBy: "User123", reason: "Spam", status: "Pending" },
  { id: 2, shoutout: "You are useless", reportedBy: "User456", reason: "Abusive Language", status: "Pending" }
];

export default function AdminShoutoutReports() {
  const [reports, setReports] = useState(initialReports);

  const resolveReport = (id, status) => {
    setReports(reports.map(r => r.id === id ? { ...r, status } : r));
  };

  const getBadgeClass = (status) => {
    if (status === "Pending") return "badge badge-pending";
    if (status === "Resolved") return "badge badge-resolved";
    if (status === "Rejected") return "badge badge-rejected";
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Shoutout Reports</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Reported By</th>
            <th>Shoutout</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(report => (
            <tr key={report.id}>
              <td>{report.reportedBy}</td>
              <td>{report.shoutout}</td>
              <td>{report.reason}</td>
              <td><span className={getBadgeClass(report.status)}>{report.status}</span></td>
              <td>
                {report.status === "Pending" && (
                  <>
                    <button className="button button-resolve" onClick={() => resolveReport(report.id, "Resolved")}>Resolve</button>
                    <button className="button button-reject" onClick={() => resolveReport(report.id, "Rejected")} style={{ marginLeft: '10px' }}>Reject</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
