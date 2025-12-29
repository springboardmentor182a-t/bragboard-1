import React, { useMemo, useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import DashboardLayout from "../components/Layout/DashboardLayout.jsx";

export default function ExportReport() {
  // ... (previous state/logic) ...
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
    <DashboardLayout>
      <div style={{ padding: 20 }} className="min-h-screen transition-colors duration-200">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6 transition-colors duration-200">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Export Reports</h2>
        </div>

        {/* Error / Loading State */}
        {error && <div className="text-red-500 mb-4 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">Error: {error}</div>}

        {/* Controls Container */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6 transition-colors duration-200">
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <button
                onClick={fetchReports}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center h-[42px]"
              >
                Refresh Data
              </button>
            </div>
          </div>

          <div className="mb-6">
            <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Visible Columns:</span>
            <div className="flex flex-wrap gap-3">
              {Object.keys(selectedColumns).map((col) => (
                <label key={col} className="inline-flex items-center space-x-2 cursor-pointer bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedColumns[col]}
                    onChange={() => toggleColumn(col)}
                    className="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-200 capitalize">{col.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={exportXLSX}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-sm flex items-center"
            >
              <span className="mr-2">📊</span> Export Excel
            </button>
            <button
              onClick={exportPDF}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-sm flex items-center"
            >
              <span className="mr-2">📄</span> Export PDF
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div ref={tableRef} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  {visibleColumns.map((col) => (
                    <th key={col} className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                      {col.replace('_', ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {!data || data.length === 0 ? (
                  <tr>
                    <td colSpan={visibleColumns.length} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      {loading ? "Loading data..." : "No reports found"}
                    </td>
                  </tr>
                ) : (
                  filtered.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      {visibleColumns.map((col) => (
                        <td key={col} className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {row[col]}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
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
