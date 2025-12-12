import { useEffect, useState } from "react";

let Report = {
  id: number,
  shoutoutText: string,
  reporterName: string,
  reason: string,
  status: "open" | "resolved",
}

export function ResolvingReportsScreen() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulated fetch — later you can connect to API
  useEffect(() => {
    setTimeout(() => {
      setReports([
        {
          id: 1,
          shoutoutText: "Great teamwork on the new project!",
          reason: "Duplicate shoutout",
          status: "open",
        },
        {
          id: 2,
          shoutoutText: "Amazing leadership in Q2!",
          reason: "Inappropriate wording",
          status: "resolved",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);





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
            {reports.map((report) => (
              <tr
                key={report.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-3 whitespace-nowrap">{report.id}</td>
                <td className="p-3 max-w-xs">
                  <div className="truncate" title={report.shoutoutText}>{report.shoutoutText}</div>
                </td>
                <td className="p-3 whitespace-nowrap">{report.reporterName}</td>
                <td className="p-3 whitespace-nowrap">{report.reason}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      report.status === "open"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {report.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}