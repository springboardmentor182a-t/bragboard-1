import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import EmployeeDashboardLayout from "../layout/EmpDashboardLayout";

import Shoutouts from "../components/employee/Shoutouts";
import Leaderboard from "../components/employee/Leaderboard";
import Notifications from "../components/employee/Notifications";
import Performance from "../components/employee/Performance";
import Settings from "../components/employee/Settings";

function EmpDashboard({ onLogout, userName }) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [dashboardData, setDashboardData] = useState(null);

  const role = localStorage.getItem("role");
  const approvalStatus = localStorage.getItem("ApprovalStatus");
  const employeeId = localStorage.getItem("userId");

  // ✅ Hooks FIRST
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/dashboard/employee/${employeeId}`)
      .then((res) => res.json())
      .then((data) => setDashboardData(data));
  }, [employeeId]);

  // ✅ Guards AFTER hooks
  if (approvalStatus === "pending") {
    return <Navigate to="/ApprovalStatus" replace />;
  }

  if (role !== "employee") {
    return <Navigate to="/login" replace />;
  }

  let SectionComponent;
  switch (activeSection) {
    case "dashboard":
      SectionComponent = <Performance data={dashboardData} />;
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
      {SectionComponent}
    </EmployeeDashboardLayout>
  );
}

export default EmpDashboard;
