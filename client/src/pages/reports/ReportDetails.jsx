import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ReportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/reports/${id}`)
      .then(res => setReport(res.data))
      .catch(() => alert("Unable to fetch report"));
  }, [id]);

  if (!report) return <p>Loading...</p>;

  const resolveReport = () => {
    axios.put(`http://localhost:8000/reports/${id}/resolve`)
      .then(() => {
        alert("Report resolved!");
        navigate("/admin/reports");
      })
      .catch(() => alert("Error resolving report"));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Report Details</h2>

      <p><strong>ID:</strong> {report.id}</p>
      <p><strong>Shoutout:</strong> {report.shoutout_text}</p>
      <p><strong>Description:</strong> {report.reason}</p>
      <p><strong>Reported By:</strong> {report.reported_by}</p>
      <p><strong>Status:</strong> {report.status}</p>

      <button
        style={{
          padding: "10px 20px",
          marginTop: "20px",
          background: "green",
          color: "white",
          cursor: "pointer",
        }}
        onClick={resolveReport}
      >
        Resolve Report
      </button>
    </div>
  );
}
