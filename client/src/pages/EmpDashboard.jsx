// EmpDashboard.jsx
import { useEffect, useState } from "react";
import { getJson } from "../api";
import EmployeeDashboardLayout from "../layout/EmpDashboardLayout";

import Shoutouts from "../components/employee/Shoutouts";
import Leaderboard from "../components/employee/Leaderboard";
import Notifications from "../components/employee/Notifications";
import Profile from "../components/employee/Profile";
import Performance from "../components/employee/Performance";
import Settings from "../components/employee/Settings";

function EmpDashboard({ onLogout, userName }) {
  const [activeSection, setActiveSection] = useState("tasks");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const employeeId = 1; // later: use real logged‑in user id

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getJson(`/api/dashboard/employee/${employeeId}`);
        setDashboardData(res);
      } catch (err) {
        console.error("Failed to load employee dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [employeeId]);

  let SectionComponent;
  switch (activeSection) {
    case "shoutouts":
      SectionComponent = <Shoutouts />;
      break;
    case "leaderboard":
      SectionComponent = <Leaderboard />;
      break;
    case "notifications":
      SectionComponent = <Notifications />;
      break;
    case "profile":
      SectionComponent = <Profile />;
      break;
    case "performance":
      SectionComponent = <Performance />;
      break;
    case "settings":
      SectionComponent = <Settings />;
      break;
    default:
      SectionComponent = <div>Select a section</div>;
  }

  if (loading) return <div>Loading employee dashboard...</div>;
  if (!dashboardData) return <div>Failed to load employee dashboard.</div>;

  return (
    <EmployeeDashboardLayout
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      onLogout={onLogout}
      userName={userName}
      dashboardData={dashboardData}   // ✅ pass data to layout
    >
      {SectionComponent}
    </EmployeeDashboardLayout>
  );
}

export default EmpDashboard;
