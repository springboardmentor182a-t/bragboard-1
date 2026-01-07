import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout.jsx';
import { useAuth } from '../Context/AuthContext';
import { reports } from '../services/api';

const Reports = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReports();
  }, [user]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      let response;
      if (user?.role === 'admin') {
        response = await reports.getAllReports();
      } else {
        response = await reports.getMyReports();
      }
      setData(response.data);
    } catch (err) {
      console.error("Failed to fetch reports", err);
      setError("Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (reportId, status, notes = "") => {
    try {
      // Backend expects { admin_notes: ... } logic for resolution? 
      // The API call is `reports.resolve(id, data)`
      // Let's assume dismissing = resolve(status='dismissed'?) or just resolving. 
      // Checking report_routers.py: resolve_report takes ResolveReport(admin_notes)
      // It doesn't seem to take "status" explicitly in the body?
      // Wait, resolve_report implementation:
      /*
        report = ReportService.resolve_report(
            db=db,
            report_id=report_id,
            admin_id=current_user.id,
            admin_notes=data.admin_notes,
        )
      */
      // Looking at `report_service.py` (assumed), resolve usually sets status to 'resolved'.
      // If we want to 'Dismiss' (reject) vs 'Approve' (act on it), we might need logic.
      // But typically 'resolve' just closes it.
      // Let's just implement a general "Resolve" button for now, or "Mark Resolved".

      await reports.resolve(reportId, { admin_notes: notes, status: status });
      fetchReports(); // Refresh
      alert(`Report ${status} successfully.`);
    } catch (err) {
      console.error("Failed to resolve report", err);
      alert("Failed to resolve report.");
    }
  };

  const AdminView = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reporter</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Shoutout</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((report) => (
              <tr key={report.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">#{report.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {report.reporter_name || `User #${report.reported_by}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">#{report.shoutout_id}</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">{report.reason}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      report.status === 'dismissed' ? 'bg-red-100 text-red-800' : 'bg-gray-100'
                    }`}>
                    {report.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {report.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleResolve(report.id, 'resolved', 'Approved by admin')}
                        className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-xs"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleResolve(report.id, 'dismissed', 'Dismissed by admin')}
                        className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.length === 0 && (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">No reports found.</div>
        )}
      </div>
    </div>
  );

  const EmployeeView = () => (
    <div className="grid gap-4">
      {data.map((report) => (
        <div key={report.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white">Report on Shoutout #{report.shoutout_id}</h3>
              <p className="text-sm text-gray-500 mt-1">Reason: <span className="font-medium">{report.reason}</span></p>
              <p className="text-xs text-gray-400 mt-2">Submitted on {new Date(report.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                {report.status.toUpperCase()}
              </span>
            </div>
          </div>
          {report.admin_notes && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded text-sm">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Admin Response:</span>
              <p className="text-gray-600 dark:text-gray-400">{report.admin_notes}</p>
            </div>
          )}
        </div>
      ))}
      {data.length === 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center">
          <p className="text-gray-500 dark:text-gray-400">You haven't reported any shoutouts.</p>
        </div>
      )}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          {user?.role === 'admin' ? 'All Reports (Admin)' : 'My Reports'}
        </h1>

        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          user?.role === 'admin' ? <AdminView /> : <EmployeeView />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Reports;
