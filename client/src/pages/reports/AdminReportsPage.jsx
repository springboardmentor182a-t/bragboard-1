import React, { useState, useEffect } from "react";
import PageContainer from "../../layout/PageContainer";
import { api } from "../../utils/api";

function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // fetch
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get("/reports");
        setReports(res.data);
      } catch (e) {
        console.error("fetch reports error", e);
      }
      setLoading(false);
    };
    fetchReports();
  }, []);

  const resolveReport = async (id) => {
    try {
      await api.put(`/reports/${id}/resolve`);
      setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Resolved" } : r)));
    } catch (e) {
      console.error("resolve error", e);
    }
  };

  const filtered = reports.filter((r) => (r.shoutout_text || "").toLowerCase().includes(search.toLowerCase()));

  if (loading) return <PageContainer><div>Loading...</div></PageContainer>;

  return (
    <PageContainer>
      <div style={{ background: "#fff", padding: 20, borderRadius: 8 }}>
        <h2>Reports Management</h2>
        <input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <table style={{ width: "100%", marginTop: 12 }}>
          <thead>...</thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.reported_by}</td>
                <td>{r.shoutout_text}</td>
                <td>{r.status}</td>
                <td>{r.status === "Pending" && <button onClick={() => resolveReport(r.id)}>Resolve</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageContainer>
  );
}
export default AdminReportsPage;
