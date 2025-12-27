import { useEffect, useState } from "react";
import { FiHome, FiAlertCircle, FiTrendingUp } from "react-icons/fi";
import { api } from "../../api";
import { useAuth } from "../../AuthContext";

interface DashboardStats {
  total_shoutouts: number;
  total_reports: number;
  pending_reports: number;
}

const EmployeeDashboard = () => {
  const { userData, loading: authLoading } = useAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!userData?.id) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await api.get(
          `/dashboard/employee?employee_id=${userData.id}`
        );
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userData, authLoading]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ---------- SIDEBAR ---------- */}
      <aside className="w-64 bg-gradient-to-b from-purple-800 to-purple-600 text-white p-6 flex flex-col shadow-xl">
        <h2 className="text-2xl font-bold mb-10 tracking-wide">BragBoard</h2>

        <nav className="space-y-3">
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/20">
            <FiHome size={18} />
            <span>Dashboard</span>
          </div>

          <a
            href="/report-shoutout"
            className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-white/10 transition"
          >
            <FiAlertCircle size={18} />
            <span>Report Shoutout</span>
          </a>
        </nav>

        <div className="mt-auto text-sm opacity-80 pt-10">
          Employee ID: {userData?.id}
        </div>
      </aside>

      {/* ---------- MAIN CONTENT ---------- */}
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Here’s a quick overview of your BragBoard activity
          </p>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading dashboard...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white p-6 rounded-2xl shadow border-l-4 border-purple-500">
                <p className="text-sm text-gray-500">Total Shoutouts</p>
                <p className="text-3xl font-bold mt-2">
                  {stats?.total_shoutouts ?? 0}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow border-l-4 border-blue-500">
                <p className="text-sm text-gray-500">Reports Raised</p>
                <p className="text-3xl font-bold mt-2">
                  {stats?.total_reports ?? 0}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow border-l-4 border-yellow-500">
                <p className="text-sm text-gray-500">Pending Reports</p>
                <p className="text-3xl font-bold mt-2">
                  {stats?.pending_reports ?? 0}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow mb-10 flex items-center justify-between border-l-4 border-green-500">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Performance Insight
                </h3>
                <p className="text-gray-500 mt-1">
                  You are actively engaging with the platform. Keep it up!
                </p>
              </div>
              <FiTrendingUp className="text-green-500 text-4xl" />
            </div>

            <div className="bg-white rounded-2xl shadow border-2 border-purple-300">
              <div className="p-5 border-b">
                <h2 className="text-lg font-semibold text-gray-700">
                  Recent Activity
                </h2>
              </div>

              <div className="p-6 text-gray-600">
                <ul className="space-y-3 list-disc ml-5">
                  <li>You reported a duplicate shoutout</li>
                  <li>You received appreciation from your team</li>
                  <li>You interacted with recent shoutouts</li>
                </ul>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default EmployeeDashboard;
