// EmpDashboard.jsx
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import EmployeeDashboardLayout from "../layout/EmpDashboardLayout";
import { getJson } from "../api";

import Shoutouts from "../components/employee/Shoutouts";
import Leaderboard from "../components/employee/Leaderboard";
import Notifications from "../components/employee/Notifications";
import Performance from "../components/employee/Performance";
import Settings from "../components/employee/Settings";

function EmpDashboard({ onLogout, userName }) {
  const [activeSection, setActiveSection] = useState("tasks");

  // 🔹 Dashboard integration states (ADDED)
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  const role = localStorage.getItem("role");
  const approvalStatus = localStorage.getItem("ApprovalStatus");

  // 🚫 Block unapproved employee
  if (approvalStatus === "pending") {
    return <Navigate to="/ApprovalStatus" replace />;
  }

  // 🚫 Block non-employee
  if (role !== "employee") {
    return <Navigate to="/login" replace />;
  }

  // 📊 Employee dashboard API call (ADDED)
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await getJson("/api/dashboard/employee");
        setDashboardData(res);
      } catch (err) {
        console.error("Failed to load employee dashboard", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  let SectionComponent;

  switch (activeSection) {
    case "shoutouts":
      SectionComponent = (
        <Shoutouts
          dashboardData={dashboardData}
          loading={loading}
        />
      );
      break;

    case "leaderboard":
      SectionComponent = <Leaderboard loading={loading} />;
      break;

    case "notifications":
      SectionComponent = (
        <Notifications
          dashboardData={dashboardData}
          loading={loading}
        />
      );
      break;

    case "performance":
      SectionComponent = (
        <Performance
          dashboardData={dashboardData}
          loading={loading}
        />
      );
      break;

    case "settings":
      SectionComponent = <Settings />;
      break;

    default:
      SectionComponent = <div>Select a section</div>;
  }

  return (
    <EmployeeDashboardLayout
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      onLogout={onLogout}
      userName={userName}
    >
      {loading ? <div>Loading dashboard...</div> : SectionComponent}
    </EmployeeDashboardLayout>
  );
}

export default EmpDashboard;
