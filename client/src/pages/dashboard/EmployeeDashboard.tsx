import { useEffect, useState } from "react";
import { api } from "../../api";
import { useAuth } from "../../hooks/useAuth";

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total_shoutouts: 0,
    total_reports: 0,
    pending_reports: 0,
  });

  useEffect(() => {
    if (!user?.id) return;

    api
      .get(`/dashboard/employee?employee_id=${user.id}`)
      .then((res) => setStats(res.data))
      .catch(() => console.error("Failed to load dashboard"));
  }, [user]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Employee Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-gray-500">My Shoutouts</p>
          <p className="text-3xl font-bold">{stats.total_shoutouts}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-gray-500">Reports Raised</p>
          <p className="text-3xl font-bold">{stats.total_reports}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-gray-500">Pending Reports</p>
          <p className="text-3xl font-bold">{stats.pending_reports}</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
