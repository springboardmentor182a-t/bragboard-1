import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ReportList() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/reports")
      .then(res => setReports(res.data))
      .catch(() => alert("Error fetching reports"));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Reported Shoutouts</h2>

      <table border="1" cellPadding="10" style={{ marginTop: "20px", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Shoutout</th>
            <th>Reporter</th>
            <th>Status</th>
            <th>View</th>
          </tr>
        </thead>

        <tbody>
          {reports.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.shoutout_text}</td>
              <td>{r.reported_by}</td>
              <td>{r.status}</td>
              <td>
                <Link to={`/admin/reports/${r.id}`}>Open</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
