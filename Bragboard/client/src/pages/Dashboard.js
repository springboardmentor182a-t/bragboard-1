import React from "react";
import StatsCards from "../components/Dashboard/StatsCards";
import Leaderboard from "../components/Dashboard/Leaderboard";
import DepartmentStats from "../components/Dashboard/DepartmentStats";

const Dashboard = () => {
  return (
    <div>
      {/* Header with Title Only - Search Bar Removed */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Leaderboard />
        <DepartmentStats />
      </div>
    </div>
  );
};

export default Dashboard;
