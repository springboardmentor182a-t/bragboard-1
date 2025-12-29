import React, { useMemo, useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";





export default function ExportReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedColumns, setSelectedColumns] = useState({
    id: true,
    shoutout_id: true,
    reported_by: true,
    reason: true,
    status: true,
    created_at: true,
    resolved_at: false,
    resolved_by: false,
    admin_notes: false
  });
  const tableRef = useRef(null);

  // Fetch reports from backend
  const fetchReports = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token"); // Assuming standard 'token' key
      if (!token) {
        throw new Error("No authentication token found. Please login.");
      }

      const response = await fetch("http://127.0.0.1:8000/reports/admin", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch reports: ${response.statusText}`);
      }

      const result = await response.json();
      // Map API data to flat structure for table if needed, or use as is
      // API returns: { id, shoutout_id, reported_by, reason, status, created_at... }
      setData(result);
    } catch (err) {
      console.error(err);
      setError(err.message);
      // Fallback to empty or keep previous data?
      // setData([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const filtered = useMemo(() => {
    if (!data) return [];
    if (!fromDate && !toDate) return data;
    return data.filter((r) => {
      const d = new Date(r.created_at);
      if (fromDate && d < new Date(fromDate)) return false;
      if (toDate && d > new Date(toDate)) return false;
      return true;
    });
  }, [data, fromDate, toDate]);

  const visibleColumns = Object.keys(selectedColumns).filter((k) => selectedColumns[k]);

  const buildRows = (rows) => {
    return rows.map((row) => {
      const out = {};
      visibleColumns.forEach((col) => (out[col] = row[col]));
      return out;
    });
  };

  // Excel export using xlsx + file-saver (Client Side)
  function exportXLSX() {
    const rows = buildRows(filtered);
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), `report_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  // PDF export using html2canvas + jsPDF (snapshot of the table preview)
  async function exportPDF() {
    if (!tableRef.current) return;
    const canvas = await html2canvas(tableRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("l", "pt", "a4"); // landscape
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`report_${new Date().toISOString().slice(0, 10)}.pdf`);
  }



  function toggleColumn(col) {
    setSelectedColumns((prev) => ({ ...prev, [col]: !prev[col] }));
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Export Reports</h2>

      {/* Error / Loading State */}
      {error && <div style={{ color: "red", marginBottom: 10 }}>Error: {error}</div>}
      {loading && <div>Loading reports...</div>}

      <div style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "center", flexWrap: "wrap" }}>
        <label>
          From: <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </label>
        <label>
          To: <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </label>

        <button onClick={fetchReports} style={{ ...buttonStyle, background: "#6b7280" }}>Refresh Data</button>

        <div style={{ marginLeft: 12 }}>
          <strong>Columns:</strong>
          {Object.keys(selectedColumns).map((col) => (
            <label key={col} style={{ marginLeft: 8 }}>
              <input type="checkbox" checked={selectedColumns[col]} onChange={() => toggleColumn(col)} /> {col}
            </label>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 12, display: "flex", gap: 8 }}>
        <button onClick={exportXLSX} style={buttonStyle}>Export Excel (Client)</button>
        <button onClick={exportPDF} style={{ ...buttonStyle, background: "#dc2626" }}>Export PDF (Client)</button>
      </div>

      <div ref={tableRef} style={{ border: "1px solid #ddd", padding: 8, borderRadius: 6, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {visibleColumns.map((col) => (
                <th key={col} style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: 6 }}>{col.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!data || data.length === 0 ? (
              <tr><td colSpan={visibleColumns.length} style={{ padding: 8 }}>{loading ? "Loading..." : "No results"}</td></tr>
            ) : (
              filtered.map((row) => (
                <tr key={row.id}>
                  {visibleColumns.map((col) => (
                    <td key={col} style={{ padding: 6, borderBottom: "1px solid #eee" }}>{row[col]}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: "8px 12px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};
