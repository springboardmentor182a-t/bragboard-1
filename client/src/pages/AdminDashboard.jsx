import { useEffect, useState } from "react";
import { getJson } from "../api";
import DashboardLayout from "../layout/DashboardLayout";
import AnalyticsCards from "../components/Admin/AnalyticsCards";
import ShoutOuts from "../components/Admin/ShoutOuts";
import Departments from "../components/Admin/Departments";
import Employees from "../components/Admin/Employees";
import Leaderboard from "../components/Admin/Leaderboard";
import DashboardOverview from "../components/Admin/DashboardOverview";

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getJson("/api/dashboard/admin");
        setDashboardData(res);
      } catch (err) {
        console.error("Failed to load admin dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  let SectionComponent;
  switch (activeSection) {
    case "dashboard":
      SectionComponent = (
        <DashboardOverview dashboardData={dashboardData} loading={loading} />
      );
      break;
    case "analytics":
      SectionComponent = <AnalyticsCards loading={loading} />;
      break;
    case "shoutouts":
      SectionComponent = <ShoutOuts />;
      break;
    case "departments":
      SectionComponent = <Departments />;
      break;
    case "employees":
      SectionComponent = <Employees />;
      break;
    case "leaderboard":
      SectionComponent = <Leaderboard loading={loading} />;
      break;
    default:
      SectionComponent = <div>Select a section.</div>;
  }

  if (loading && !dashboardData) return <div>Loading admin dashboard...</div>;
  if (!dashboardData) return <div>Failed to load admin dashboard.</div>;

  return (
    <DashboardLayout
      activeSection={activeSection}
      setActiveSection={setActiveSection}
    >
      {SectionComponent}
    </DashboardLayout>
  );
}

export default AdminDashboard;
