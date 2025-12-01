// src/reports/ReportDetails.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from "../../api";

export function ReportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get(`/reports/${id}`);
        setReport(res.data);
      } catch (err) {
        alert('Unable to fetch report');
      }
    };
    fetchReport();
  }, [id]);

  const resolveReport = async () => {
    try {
      await api.put(`/reports/${id}/resolve`);
      alert('Report resolved!');
      navigate('/'); // redirect to dashboard or reports list
    } catch {
      alert('Error resolving report');
    }
  };

  if (!report) return <div>Loading...</div>;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Report Details</h2>
      <p><strong>ID:</strong> {report.id}</p>
      <p><strong>Shoutout:</strong> {report.shoutout_text}</p>
      <p><strong>Description:</strong> {report.reason}</p>
      <p><strong>Reported By:</strong> {report.reported_by}</p>
      <p><strong>Status:</strong> {report.status}</p>

      {report.status === 'Pending' && (
        <button
          onClick={resolveReport}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
        >
          Resolve Report
        </button>
      )}
    </div>
  );
}
