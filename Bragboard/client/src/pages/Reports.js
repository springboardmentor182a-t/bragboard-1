import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout.jsx';
import { reports } from '../services/api';

const Reports = () => {
  const [myReports, setMyReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Note: Create report usually happens on the Shoutout itself (e.g. "Report this shoutout"), 
  // but we can list them here.

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await reports.getMyReports();
      setMyReports(response.data);
    } catch (err) {
      console.error("Failed to fetch reports", err);
      setError("Failed to load your reports.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">My Reports</h1>

        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && myReports.length === 0 && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center">
            <p className="text-gray-500 dark:text-gray-400">You haven't reported any shoutouts.</p>
          </div>
        )}

        <div className="grid gap-4">
          {myReports.map((report) => (
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
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
