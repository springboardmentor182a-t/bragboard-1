// src/reports/ReportList.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// Define the type for a report
interface Report {
  id: number;
  shoutout_text: string;
  reason: string;
  reported_by: string;
  status: string;
}

export default function ReportList() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get<Report[]>("http://localhost:8000/reports");
        setReports(res.data);
      } catch (error) {
        alert("Error fetching reports");
        console.error(error);
      }
    };
    fetchReports();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Reported Shoutouts</h2>

      <table border={1} cellPadding={10} style={{ marginTop: "20px", width: "100%" }}>
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
          {reports.map((r) => (
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
