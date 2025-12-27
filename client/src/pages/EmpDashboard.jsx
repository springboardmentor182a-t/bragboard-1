import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import EmployeeDashboardLayout from "../layout/EmpDashboardLayout";

import Overview from "../components/employee/Overview";
import Shoutouts from "../components/employee/Shoutouts";
import Leaderboard from "../components/employee/Leaderboard";
import Notifications from "../components/employee/Notifications";
import Performance from "../components/employee/Performance";
import Settings from "../components/employee/Settings";

function EmpDashboard({ onLogout, userName }) {
  const [activeSection, setActiveSection] = useState("overview");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const role = localStorage.getItem("role");
  const approvalStatus = localStorage.getItem("ApprovalStatus");

  // ✅ sanitize employeeId
  const rawEmployeeId = localStorage.getItem("userId");
  const employeeId = rawEmployeeId
    ? parseInt(rawEmployeeId.replace(/[^0-9]/g, ""))
    : null;

  useEffect(() => {
    // ✅ FIX: stop loading if employeeId is missing/invalid
    if (!employeeId || isNaN(employeeId)) {
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `http://127.0.0.1:8000/api/dashboard/employee/${employeeId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data = await response.json();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [employeeId]);

  // Guards AFTER hooks
  if (approvalStatus === "pending") {
    return <Navigate to="/ApprovalStatus" replace />;
  }

  if (role !== "employee") {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <EmployeeDashboardLayout
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogout={onLogout}
        userName={userName}
      >
        <div className="flex items-center justify-center h-full">
          <p>Loading dashboard...</p>
        </div>
      </EmployeeDashboardLayout>
    );
  }

  if (error) {
    return (
      <EmployeeDashboardLayout
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogout={onLogout}
        userName={userName}
      >
        <div className="flex items-center justify-center h-full">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </EmployeeDashboardLayout>
    );
  }

  let SectionComponent;

  switch (activeSection) {
    case "overview":
      SectionComponent = <Overview data={dashboardData} />;
      break;
    case "shoutouts":
      SectionComponent = <Shoutouts />;
      break;
    case "leaderboard":
      SectionComponent = <Leaderboard />;
      break;
    case "notifications":
      SectionComponent = <Notifications />;
      break;
    case "performance":
      SectionComponent = <Performance data={dashboardData} />;
      break;
    case "settings":
      SectionComponent = <Settings />;
      break;
    default:
      SectionComponent = <Overview data={dashboardData} />;
  }

  return (
    <EmployeeDashboardLayout
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      onLogout={onLogout}
      userName={userName}
    >
      {SectionComponent}
    </EmployeeDashboardLayout>
  );
}

export default EmpDashboard;
