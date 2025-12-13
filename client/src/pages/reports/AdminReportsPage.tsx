import { useEffect, useState } from "react";
import axios from "axios";

interface Report {
  id: number;
  shoutout_id: number;
  reported_by: number;
  reason: string;
  status: string;
  reported_at: string;
  resolved_by?: number;
  resolved_at?: string;
}

const AdminReportsPage = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);

  const ADMIN_ID = 1;

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/reports/admin");
      setReports(res.data);
    } catch (error) {
      console.error("Error fetching reports", error);
    }
  };

  const resolveReport = async (reportId: number, action: "RESOLVE" | "REJECT") => {
    try {
      setLoading(true);
      await axios.post("http://127.0.0.1:8000/reports/admin/resolve", {
        report_id: reportId,
        action,
        admin_id: ADMIN_ID,
      });
      fetchReports();
    } catch (error) {
      alert("Failed to update report");
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.reason.toLowerCase().includes(search.toLowerCase()) ||
      String(r.id).includes(search);

    const matchesStatus =
      statusFilter === "ALL" ? true : r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const openCount = reports.filter((r) => r.status === "PENDING").length;
  const resolvedCount = reports.filter((r) => r.status === "RESOLVED").length;
  const rejectedCount = reports.filter((r) => r.status === "REJECTED").length;

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* ✅ PURPLE SIDEBAR */}
      <div className="w-64 bg-purple-700 text-white flex flex-col p-6">
        <h2 className="text-xl font-bold mb-8">Admin Panel</h2>

        <button className="bg-purple-900 py-3 rounded text-left px-4 font-semibold">
          Resolve Reports
        </button>
      </div>

      {/* ✅ MAIN CONTENT */}
      <div className="flex-1 p-8">

        <h1 className="text-2xl font-bold mb-6">Resolve Reports</h1>

        {/* ✅ SEARCH + FILTER ROW */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by report ID or reason"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3 border p-2 rounded shadow"
          />

          {/* ✅ FILTER DROPDOWN (NEW, ONLY ADDITION) */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-48 border p-2 rounded shadow"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="RESOLVED">Resolved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {/* ✅ REPORT TABLE */}
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-purple-100 text-left">
                <th className="p-3">Report ID</th>
                <th className="p-3">Shoutout ID</th>
                <th className="p-3">Reported By</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id} className="border-t">
                  <td className="p-3">{report.id}</td>
                  <td className="p-3">{report.shoutout_id}</td>
                  <td className="p-3">{report.reported_by}</td>
                  <td className="p-3">{report.reason}</td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        report.status === "PENDING"
                          ? "bg-yellow-200 text-yellow-800"
                          : report.status === "RESOLVED"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>

                  <td className="p-3 space-x-3">
                    {report.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => resolveReport(report.id, "RESOLVE")}
                          disabled={loading}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
                        >
                          Resolve
                        </button>

                        <button
                          onClick={() => resolveReport(report.id, "REJECT")}
                          disabled={loading}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ✅ BOTTOM COLORED STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

          <div className="bg-white p-6 rounded-xl shadow flex justify-between border border-purple-200">
            <div>
              <p className="text-sm text-gray-500">Open Reports</p>
              <p className="text-3xl font-bold">{openCount}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-300 rounded-full" />
          </div>

          <div className="bg-white p-6 rounded-xl shadow flex justify-between border border-purple-200">
            <div>
              <p className="text-sm text-gray-500">Resolved Reports</p>
              <p className="text-3xl font-bold">{resolvedCount}</p>
            </div>
            <div className="w-10 h-10 bg-green-300 rounded-full" />
          </div>

          <div className="bg-white p-6 rounded-xl shadow flex justify-between border border-purple-200">
            <div>
              <p className="text-sm text-gray-500">Rejected Reports</p>
              <p className="text-3xl font-bold">{rejectedCount}</p>
            </div>
            <div className="w-10 h-10 bg-red-300 rounded-full" />
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminReportsPage;
