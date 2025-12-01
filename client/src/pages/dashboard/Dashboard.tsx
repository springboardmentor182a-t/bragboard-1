// src/pages/dashboard/Dashboard.tsx
import React from "react";
import DashboardOverview, { DashboardOverviewProps } from "./DashboardOverview";

export const Dashboard: React.FC<DashboardOverviewProps> = ({ userRole, userData, onLogout }) => {
  return <DashboardOverview userRole={userRole} userData={userData} onLogout={onLogout} />;
};
