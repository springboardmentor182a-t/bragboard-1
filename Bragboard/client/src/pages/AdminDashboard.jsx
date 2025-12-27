import React from "react";
import DashboardLayout from "../components/Layout/DashboardLayout.jsx";
import DashboardStats from "../components/DashboardStats";
import DashboardCharts from "../components/DashboardCharts";
import DashboardTable from "../components/DashboardTable";
import "../AdminAnalytics.css";

const AdminDashboard = () => {
  return (
    <DashboardLayout>
      <div className="admin-dashboard-header mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Admin Dashboard
        </h2>
      </div>

      {/* Main content */}
      <div className="space-y-8">
        <DashboardStats />
        <DashboardCharts />
        <DashboardTable />
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;