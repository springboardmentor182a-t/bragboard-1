import React from "react";

const DashboardStats = ({ stats = {} }) => {
  const statItems = [
    { value: stats.total_employees || '--', label: 'Total Employees' },
    { value: stats.total_shoutouts || '--', label: 'Total Shout-outs' },
    { value: stats.total_departments || '--', label: 'Total Departments' },
    { value: stats.pending_approvals || '--', label: 'Pending Approvals' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statItems.map((stat, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200 text-center">
          <div className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{stat.value}</div>
          <div className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
