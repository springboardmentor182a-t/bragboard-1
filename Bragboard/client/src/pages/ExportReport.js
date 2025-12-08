import React, { useMemo, useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";



const mockData = [
  { id: 1, date: "2025-12-01", from: "Alice", to: "Bob", message: "Great teamwork!", tag: "Teamwork" },
  { id: 2, date: "2025-12-02", from: "Charlie", to: "Diana", message: "Excellent support!", tag: "Support" },
  { id: 3, date: "2025-12-03", from: "Eva", to: "Frank", message: "Loved your presentation", tag: "Presentation" },
];

export default function ExportReport() {
  const [data, setData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedColumns, setSelectedColumns] = useState({
    id: true,
    date: true,
    from: true,
    to: true,
    message: true,
    tag: true,
  });
  const tableRef = useRef(null);

  useEffect(() => {
    setData(mockData);
  }, []);

  const filtered = useMemo(() => {
    if (!fromDate && !toDate) return data;
    return data.filter((r) => {
      const d = new Date(r.date);
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

  // Excel export using xlsx + file-saver
  function exportXLSX() {
    const rows = buildRows(filtered);
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), `report_${new Date().toISOString().slice(0,10)}.xlsx`);
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
    pdf.save(`report_${new Date().toISOString().slice(0,10)}.pdf`);
  }

  function toggleColumn(col) {
    setSelectedColumns((prev) => ({ ...prev, [col]: !prev[col] }));
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Export Reports</h2>

      <div style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "center" }}>
        <label>
          From: <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </label>
        <label>
          To: <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </label>

        <div style={{ marginLeft: 12 }}>
          <strong>Columns:</strong>
          {Object.keys(selectedColumns).map((col) => (
            <label key={col} style={{ marginLeft: 8 }}>
              <input type="checkbox" checked={selectedColumns[col]} onChange={() => toggleColumn(col)} /> {col}
            </label>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <button onClick={exportXLSX} style={buttonStyle}>Export Excel</button>
        <button onClick={exportPDF} style={{ ...buttonStyle, marginLeft: 8 }}>Export PDF</button>
      </div>

      <div ref={tableRef} style={{ border: "1px solid #ddd", padding: 8, borderRadius: 6 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {visibleColumns.map((col) => (
                <th key={col} style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: 6 }}>{col.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={visibleColumns.length} style={{ padding: 8 }}>No results</td></tr>
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
