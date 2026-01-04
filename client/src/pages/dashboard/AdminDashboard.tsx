import { useEffect, useState } from "react";
import { api } from "../../api";
import { FiUsers, FiMessageSquare, FiAlertCircle } from "react-icons/fi";

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.get("/dashboard/admin").then((res) => setStats(res.data));
  }, []);

  if (!stats) {
    return <p className="p-8 text-gray-600">Loading dashboard...</p>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-purple-700 text-white p-6">
        <h2 className="text-xl font-bold mb-8">Admin Panel</h2>
        <a
          href="/admin/dashboard"
          className="block bg-purple-900 px-4 py-2 rounded mb-3"
        >
          Dashboard
        </a>
        <a
          href="/admin/reports"
          className="block hover:bg-purple-600 px-4 py-2 rounded"
        >
          Reports
        </a>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card
            title="Employees"
            value={stats.total_employees}
            icon={<FiUsers />}
          />
          <Card
            title="Shoutouts"
            value={stats.total_shoutouts}
            icon={<FiMessageSquare />}
          />
          <Card
            title="Reports"
            value={stats.total_reports}
            icon={<FiAlertCircle />}
          />
          <Card
            title="Pending Reports"
            value={stats.pending_reports}
            icon={<FiAlertCircle />}
            highlight
          />
        </div>
      </main>
    </div>
  );
};

const Card = ({
  title,
  value,
  icon,
  highlight = false,
}: any) => (
  <div
    className={`bg-white p-6 rounded-xl shadow border-l-4 ${
      highlight ? "border-red-500" : "border-purple-500"
    }`}
  >
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <div className="text-2xl text-gray-400">{icon}</div>
    </div>
  </div>
);

export default AdminDashboard;
