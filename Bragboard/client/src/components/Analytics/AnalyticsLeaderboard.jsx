import React from "react";

const AnalyticsLeaderboard = ({ contributors = [] }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Top Contributors
      </h3>

      <div className="space-y-3">
        {contributors.map((leader, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index === 0
                    ? "bg-yellow-500"
                    : index === 1
                    ? "bg-gray-400"
                    : "bg-orange-500"
                }`}
              >
                <span className="text-white font-bold">{index + 1}</span>
              </div>

              <span className="font-medium text-gray-800">
                {leader.name}
              </span>
            </div>

            <span className="text-sm text-gray-600">
              {leader.count} shoutouts
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsLeaderboard;
