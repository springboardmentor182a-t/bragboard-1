import { useState, useEffect } from 'react';
import { Navigate } from "react-router-dom";

import DashboardLayout from "../layout/DashboardLayout";
import { getJson } from "../api";

import ShoutOuts from '../components/Admin/ShoutOuts';
import AnalyticsCards from '../components/Admin/AnalyticsCards';
import ShoutOutsPage from '../components/Common/ShoutOuts';
import Departments from '../components/Admin/Departments';
import Employees from '../components/Admin/Employees';
import Leaderboard from '../components/Admin/Leaderboard';
import DashboardOverview from '../components/Admin/DashboardOverview';
import ApprovalRequests from "../components/Admin/ApprovalRequests";

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');

  // 🔹 Dashboard integration states (ADDED)
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  const role = localStorage.getItem("role");

  if (role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  // 🔹 Dashboard API call (ADDED)
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await getJson("/api/dashboard/admin");
        setDashboardData(res);
      } catch (err) {
        console.error("Failed to load admin dashboard", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  let SectionComponent;
  switch (activeSection) {

    case 'dashboard':
      SectionComponent = (
        <DashboardOverview
          dashboardData={dashboardData}
          loading={loading}
        />
      );
      break;

    case 'shoutouts':
      SectionComponent = <ShoutOuts />;
      break;

    case 'departments':
      SectionComponent = <Departments />;
      break;

    case 'analytics':
      SectionComponent = <AnalyticsCards loading={loading} />;
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
    <DashboardLayout
      activeSection={activeSection}
      setActiveSection={setActiveSection}
    >
      {activeSection === 'dashboard' && loading
        ? <div>Loading dashboard...</div>
        : SectionComponent}
    </DashboardLayout>
  );
}

export default AdminDashboard;
