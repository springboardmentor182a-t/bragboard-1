import { useState } from "react";
import EmployeeDashboardLayout from "../layout/EmpDashboardLayout";

import Tasks from "../components/employee/Tasks";
import Shoutouts from "../components/employee/Shoutouts";
import Attendance from "../components/employee/Attendance";
import Leaderboard from "../components/employee/Leaderboard";
import Notifications from "../components/employee/Notifications";
import Profile from "../components/employee/Profile";
import Performance from "../components/employee/Performance";
import Settings from "../components/employee/Settings";

function EmpDashboard() {
  const [activeSection, setActiveSection] = useState("tasks");

  let SectionComponent;

  switch (activeSection) {
    case "tasks":
      SectionComponent = <Tasks />;
      break;
    case "shoutouts":
      SectionComponent = <Shoutouts />;
      break;
    case "attendance":
      SectionComponent = <Attendance />;
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

  return (
    <EmployeeDashboardLayout 
      activeSection={activeSection}
      setActiveSection={setActiveSection}
    >
      {SectionComponent}
    </EmployeeDashboardLayout>
  );
}

export default EmpDashboard;

