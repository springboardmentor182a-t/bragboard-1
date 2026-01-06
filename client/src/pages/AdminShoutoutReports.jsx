import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminShoutoutReports() {
  const [reports, setReports] = useState([]);

  // Fetch reports from API (ADMIN ONLY)
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/reports",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports", error);
    }
  };

  const resolveReport = async (id, status) => {
    try {
      await axios.patch(
        `http://localhost:8000/reports/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      // Update UI after success
      setReports(prev =>
        prev.map(r =>
          r.id === id ? { ...r, status } : r
        )
      );
    } catch (error) {
      console.error("Error updating report", error);
    }
  };

  const getBadgeClass = (status) => {
    if (status === "Pending") return "badge badge-pending";
    if (status === "Resolved") return "badge badge-resolved";
    if (status === "Rejected") return "badge badge-rejected";
  };

  return (
    <div>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>
        Shoutout Reports
      </h2>

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
          {reports.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No reports found
              </td>
            </tr>
          ) : (
            reports.map(report => (
              <tr key={report.id}>
                <td>{report.reported_by}</td>
                <td>{report.shoutout_text}</td>
                <td>{report.reason}</td>
                <td>
                  <span className={getBadgeClass(report.status)}>
                    {report.status}
                  </span>
                </td>
                <td>
                  {report.status === "Pending" && (
                    <>
                      <button
                        className="button button-resolve"
                        onClick={() =>
                          resolveReport(report.id, "Resolved")
                        }
                      >
                        Resolve
                      </button>

                      <button
                        className="button button-reject"
                        onClick={() =>
                          resolveReport(report.id, "Rejected")
                        }
                        style={{ marginLeft: "10px" }}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
