import React from 'react';

const Leaderboard = ({ leaders = [] }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Top Contributors</h3>

      <div className="space-y-3">
        {leaders.length > 0 ? (
          leaders.map((leader, index) => {
            // Use name, employee_name, or fallback to employee_id
            const displayName = leader.name || leader.employee_name || leader.sender_name || 
                             (leader.employee_id ? `Employee #${leader.employee_id}` : 'Unknown');
            
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-orange-500' : 'bg-blue-400'
                  }`}>
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {displayName}
                  </span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {leader.sent_shoutouts || leader.count || 0} shoutouts
                </span>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-sm">No activity yet.</p>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;