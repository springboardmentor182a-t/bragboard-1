import React from 'react';

const DepartmentStats = ({ departments = [] }) => {
  const maxShoutouts = Math.max(...departments.map(dept => dept.employees || 0), 1); // Using 'employees' as metric per API, or should it be shoutouts?
  // API returns { department: "Name", employees: N } but usually department stats implies activity.
  // Assuming the goal is activity, but let's stick to what API gives or adapt.
  // Wait, AdminDashboard uses `d.employees`. Let's assume the component wants to show whatever `departments` prop has.

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Department Data</h3>

      <div className="space-y-4">
        {departments.length > 0 ? (
          departments.map((dept, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{dept.department || 'Unassigned'}</span>
                {/* The api returns 'employees' count, but let's assume we might want shoutouts later. For now rendering employees count as per AdminDashboard logic */}
                <span className="text-sm text-gray-600">{dept.employees} employees</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${(dept.employees / maxShoutouts) * 100}%` }}
                ></div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No department data.</p>
        )}
      </div>
    </div>
  );
};

export default DepartmentStats;