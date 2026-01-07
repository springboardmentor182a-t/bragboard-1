import React from 'react';

const DepartmentStats = ({ departments = [] }) => {
  const maxShoutouts = Math.max(...departments.map(dept => dept.shoutouts || 0), 1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Department Data</h3>

      <div className="space-y-4">
        {departments.length > 0 ? (
          departments.map((dept, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{dept.name || 'Unassigned'}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{dept.shoutouts} shoutouts</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${(dept.shoutouts / maxShoutouts) * 100}%` }}
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