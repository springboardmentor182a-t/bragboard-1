import React from "react";

const Leaderboard = () => {
  const leaders = [
    { rank: 1, name: "John Smith", shoutouts: 15 },
    { rank: 2, name: "Mike Chen", shoutouts: 12 },
    { rank: 3, name: "Alex Rivera", shoutouts: 10 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Top Contributors
      </h3>

      <div className="space-y-3">
        {leaders.map((leader) => (
          <div
            key={leader.rank}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  leader.rank === 1
                    ? "bg-yellow-500"
                    : leader.rank === 2
                    ? "bg-gray-400"
                    : "bg-orange-500"
                }`}
              >
                <span className="text-white font-bold text-sm">
                  {leader.rank}
                </span>
              </div>
              <span className="font-medium text-gray-800">{leader.name}</span>
            </div>
            <span className="text-sm text-gray-600">
              {leader.shoutouts} shoutouts
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
