// src/pages/reports/ReportShoutoutPage.tsx
import React, { useEffect, useState } from "react";
import { api } from "../../api";
import { toast } from "sonner";
import { FiAlertCircle } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";

interface Report {
  id: number;
  shoutout_id: number;
  reason: string;
  status: string;
  reported_at: string;
}

const ReportShoutoutPage: React.FC = () => {
  const { user } = useAuth(); // ✅ dynamic user
  const [shoutoutId, setShoutoutId] = useState("");
  const [reason, setReason] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    if (!user?.id) return;

    try {
      const res = await api.get(`/reports/my-reports?employee_id=${user.id}`);
      setReports(res.data);
    } catch {
      toast.error("Failed to fetch reports");
    }
  };

  useEffect(() => {
    fetchReports();
  }, [user]);

  const handleReport = async () => {
    if (!shoutoutId || !reason) {
      toast.error("Fill all fields");
      return;
    }

    if (!user?.id) {
      toast.error("User not logged in");
      return;
    }

    setLoading(true);
    try {
      await api.post("/reports/", {
        shoutout_id: Number(shoutoutId),
        reason,
        reported_by: user.id, // ✅ dynamic ID
      });

      toast.success("Shoutout reported!");
      setShoutoutId("");
      setReason("");
      fetchReports();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gradient-to-b from-purple-800 to-purple-600 text-white p-6 flex flex-col shadow-xl">
        <h2 className="text-2xl font-bold mb-8 tracking-wide">BragBoard</h2>

        <nav className="space-y-3">
          <button className="flex items-center gap-3 text-left w-full px-4 py-2 rounded-xl bg-white/20">
            <FiAlertCircle size={18} />
            <span>Report Shoutout</span>
          </button>
        </nav>

        <div className="mt-auto text-sm opacity-80 pt-10">
          Employee ID: {user?.id}
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Report a Shoutout</h1>
          <p className="text-gray-500">
            Report inappropriate or duplicate shout-outs
          </p>
        </div>

        {/* FORM */}
        <div className="bg-white p-6 rounded-2xl shadow mb-10 max-w-3xl border-2 border-purple-300">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Submit a Report
          </h2>

          <div className="space-y-4">
            <input
              type="number"
              placeholder="Enter Shoutout ID"
              value={shoutoutId}
              onChange={(e) => setShoutoutId(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />

            <textarea
              placeholder="Reason for reporting"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg min-h-[100px]"
            />

            <button
              onClick={handleReport}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg disabled:opacity-60"
            >
              {loading ? "Reporting..." : "Submit Report"}
            </button>
          </div>
        </div>

        {/* MY REPORTS */}
        <div className="bg-white rounded-2xl shadow overflow-hidden border-2 border-purple-300">
          <div className="p-5 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-700">My Reports</h2>
            <span className="text-sm text-gray-500">
              Total: {reports.length}
            </span>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Shoutout</th>
                <th className="p-3 text-left">Reason</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Reported At</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3">{r.id}</td>
                  <td className="p-3">#{r.shoutout_id}</td>
                  <td className="p-3">{r.reason}</td>
                  <td className="p-3">{r.status}</td>
                  <td className="p-3">
                    {new Date(r.reported_at).toLocaleString()}
                  </td>
                </tr>
              ))}

              {reports.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    No reports submitted yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default ReportShoutoutPage;
