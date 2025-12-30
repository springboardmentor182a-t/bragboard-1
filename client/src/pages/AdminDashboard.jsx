import { useState, useEffect } from 'react';
import { Navigate } from "react-router-dom";

import DashboardLayout from "../layout/DashboardLayout";
import ShoutOuts from '../components/Admin/ShoutOuts';
import ShoutOuts from '../components/Admin/ShoutoutsPage';
import AnalyticsCards from '../components/Admin/AnalyticsCards';
import ShoutOutsPage from '../components/Common/ShoutOuts';
import Departments from '../components/Admin/Departments';
import Employees from '../components/Admin/Employees';
import Leaderboard from '../components/Admin/Leaderboard';
import DashboardOverview from '../components/Admin/DashboardOverview';
import ApprovalRequests from "../components/Admin/ApprovalRequests";


function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  if (role !== "admin") {
  return <Navigate to="/login" replace />;
}

  const role = localStorage.getItem("role");
  const adminId = localStorage.getItem("userId");

  // 🔹 DASHBOARD API INTEGRATION
  useEffect(() => {
    if (!adminId) return;

    fetch(`http://127.0.0.1:8000/api/dashboard/admin/${adminId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load dashboard");
        return res.json();
      })
      .then((data) => {
        setDashboardData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [adminId]);

  // 🔒 Role guard
  if (role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  let SectionComponent;
  switch (activeSection) {
    case 'dashboard':
      SectionComponent = (
        <DashboardOverview
          data={dashboardData}
          loading={loading}
          error={error}
        />
      );
      break;

    case 'analytics':
      SectionComponent = (
        <AnalyticsCards
          data={dashboardData}
          loading={loading}
        />
      );
      break;

    case 'leaderboard':
      SectionComponent = (
        <Leaderboard
          data={dashboardData?.leaderboard}
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

    case 'employees':
      SectionComponent = <Employees />;
      break;

    case 'approvals':
      SectionComponent = <ApprovalRequests />;
      break;

    case 'exportreports':
      SectionComponent = <ExportReports />;
      break;

    default:
      SectionComponent = <div>Select a section.</div>;
  }

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



