<<<<<<< HEAD
// EmpDashboard.jsx
import { useState } from "react";
import { Navigate } from "react-router-dom";
import EmployeeDashboardLayout from "../layout/EmpDashboardLayout";

import Shoutouts from "../components/employee/Shoutouts";
import Leaderboard from "../components/employee/Leaderboard";
import Notifications from "../components/employee/Notifications";
import Performance from "../components/employee/Performance";
import Settings from "../components/employee/Settings";

function EmpDashboard({ onLogout, userName }) {
  
  const [activeSection, setActiveSection] = useState("tasks");

  
  const role = localStorage.getItem("role");
  const approvalStatus = localStorage.getItem("ApprovalStatus");

  //  Block unapproved employee
  if (approvalStatus === "pending") {
    return <Navigate to="/ApprovalStatus" replace />;
  }

  //  Block non-employee
  if (role !== "employee") {
    return <Navigate to="/login" replace />;
  }

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
    case "performance":
      SectionComponent = <Performance />;
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
=======
// EmpDashboard.jsx
import { useState } from "react";
import { Navigate } from "react-router-dom";
import EmployeeDashboardLayout from "../layout/EmpDashboardLayout";

import Shoutouts from "../components/employee/Shoutouts";
import Leaderboard from "../components/employee/Leaderboard";
import Notifications from "../components/employee/Notifications";
import Performance from "../components/employee/Performance";
import Settings from "../components/employee/Settings";

function EmpDashboard({ onLogout, userName }) {
  
  const [activeSection, setActiveSection] = useState("tasks");

  
  const role = localStorage.getItem("role");
  const approvalStatus = localStorage.getItem("ApprovalStatus");

  //  Block unapproved employee
  if (approvalStatus === "pending") {
    return <Navigate to="/ApprovalStatus" replace />;
  }

  //  Block non-employee
  if (role !== "employee") {
    return <Navigate to="/login" replace />;
  }

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
    case "performance":
      SectionComponent = <Performance />;
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
>>>>>>> 3e2424c214281832d92a15cbeb86496329d2c772
