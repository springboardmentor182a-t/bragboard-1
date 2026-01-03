import { useEffect, useState } from "react";
import { api } from "../../api";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "sonner";

export function ResolvingReportsScreen() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get(`/reports/my-reports?employee_id=${user.id}`);
      setReports(res.data);
    } catch (error) {
      toast.error("Failed to fetch reports");
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [user]);





  if (loading) {
    return <p className="text-gray-600">Loading reports...</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-gray-900 mb-2 text-2xl font-semibold">
          Reports Status
        </h1>
        <p className="text-gray-600">
          View Status of reported shoutout by you
        </p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="p-3 whitespace-nowrap">ID</th>
              <th className="p-3 whitespace-nowrap">Shoutout</th>
              <th className="p-3 whitespace-nowrap">Reason</th>
              <th className="p-3 whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 && !loading ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  No reports submitted yet.
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr
                  key={report.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-3 whitespace-nowrap">{report.id}</td>
                  <td className="p-3 max-w-xs">
                    <div className="truncate" title={`Shoutout #${report.shoutout_id}`}>
                      Shoutout #{report.shoutout_id}
                    </div>
                  </td>
                  <td className="p-3 whitespace-nowrap">{report.reason}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        report.status === "PENDING" || report.status === "open"
                          ? "bg-yellow-100 text-yellow-700"
                          : report.status === "RESOLVED" || report.status === "resolved"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
