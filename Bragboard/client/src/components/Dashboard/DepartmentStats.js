import React from "react";

const DepartmentStats = () => {
  const departments = [
    { name: "Engineering", shoutouts: 45 },
    { name: "Marketing", shoutouts: 28 },
    { name: "Sales", shoutouts: 32 },
    { name: "Design", shoutouts: 19 },
    { name: "HR", shoutouts: 12 },
  ];

  const maxShoutouts = Math.max(...departments.map((dept) => dept.shoutouts));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Department Performance
      </h3>

      <div className="space-y-4">
        {departments.map((dept, index) => (
          <div key={index}>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">
                {dept.name}
              </span>
              <span className="text-sm text-gray-600">
                {dept.shoutouts} shoutouts
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${(dept.shoutouts / maxShoutouts) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentStats;
