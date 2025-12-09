// EmpDashboard.jsx
import { useState } from "react";
import EmployeeDashboardLayout from "../layout/EmpDashboardLayout";


import Shoutouts from "../employee/Shoutouts";
import Leaderboard from "../employee/Leaderboard";
import Notifications from "../employee/Notifications";
import Performance from "../employee/Performance";
import Settings from "../employee/Settings";

function EmpDashboard({ onLogout, userName }) {
  const [activeSection, setActiveSection] = useState("tasks");

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
