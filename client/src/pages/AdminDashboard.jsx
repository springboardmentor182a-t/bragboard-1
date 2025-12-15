import { useState } from 'react';
import DashboardLayout from "../layout/DashboardLayout";

import ShoutOuts from '../components/Admin/ShoutOuts';
import AnalyticsCards from '../components/Admin/AnalyticsCards';
import ShoutOutsPage from '../components/Common/ShoutOuts';
import Departments from '../components/Admin/Departments';
import Employees from '../components/Admin/Employees';
import Leaderboard from '../components/Admin/Leaderboard';
import { Navigate } from "react-router-dom"; 

import ApprovalRequests from "../components/Admin/ApprovalRequests";


function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading] = useState(false);
  const role = localStorage.getItem("role");

if (role !== "admin") {
  return <Navigate to="/login" replace />;
}


  let SectionComponent; 
  switch (activeSection) {
    
    case 'shoutouts':
      SectionComponent = <ShoutOuts />;
      break;
    case 'departments':
      SectionComponent = <Departments />;
      break;
    case 'employees':
      SectionComponent = <Employees />;
      break;
    case 'leaderboard':
      SectionComponent = <Leaderboard loading={loading} />;
      break;
    case 'approvals':
      SectionComponent = <ApprovalRequests />;
      break;

    default:
      SectionComponent = <div>Select a section.</div>;
  }

  return (
    <DashboardLayout activeSection={activeSection} setActiveSection={setActiveSection}>
      {SectionComponent}
    </DashboardLayout>
  );
}
export default AdminDashboard;

