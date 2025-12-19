import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import DashboardStats from "../components/DashboardStats";
import DashboardCharts from "../components/DashboardCharts";
import DashboardTable from "../components/DashboardTable";
import "../AdminAnalytics.css";

const AdminDashboard = () => {
  return (
    <div className="admin-layout">

      {/* Sidebar navigation */}
      <Sidebar />

      <div className="main-section">

        {/* Top navigation bar */}
        <Topbar />

        {/* Dashboard title */}
        <h2>Admin Dashboard</h2>
        <p style={{ color: "#777" }}>
          Overview of system metrics and activities (placeholder view)
        </p>

        {/* Placeholder statistic cards */}
        <DashboardStats />

        {/* Placeholder charts area */}
        <DashboardCharts />

        {/* Placeholder table */}
        <DashboardTable />

      </div>
    </div>
  );
};

export default AdminDashboard;
