import React from 'react';
import StatsCards from '../components/Dashboard/StatsCards';
import Leaderboard from '../components/Dashboard/Leaderboard';
import DepartmentStats from '../components/Dashboard/DepartmentStats';

const Dashboard = () => {
  // Sample shoutout posts data
  const shoutouts = [
    {
      id: 1,
      sender: "John Smith",
      recipient: "Jane Doe",
      message: "Awesome work on the Q3 Project! Your attention to detail really made the difference.",
      timestamp: "2 hours ago",
      reactions: { like: 5, clap: 3, star: 2 },
      comments: [
        { id: 1, user: "Mike Chen", message: "Absolutely! Jane was amazing!", timestamp: "1 hour ago" }
      ]
    },
    {
      id: 2,
      sender: "Sarah Lee",
      recipient: "Team Alpha",
      message: "Crushed those deadlines! Incredible teamwork everyone!",
      timestamp: "4 hours ago",
      reactions: { like: 8, clap: 4, star: 1 },
      comments: []
    }
  ];

  return (
    <div className="w-full max-w-full overflow-hidden">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-white pt-2 pb-4 border-b border-gray-200 mb-6 -mx-6 px-6">
        <h1 className="text-2xl font-bold text-gray-800">Employee Dashboard</h1>
      </div>
      
      <div className="pt-2">
        <StatsCards />
        
        {/* Top Contributors and Department Performance FIRST */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mt-6">
          <Leaderboard />
          <DepartmentStats />
        </div>

        {/* Shoutouts Feed Section - AFTER the charts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Recent Shout-Outs</h2>
            <p className="text-gray-600 mt-1">Latest recognition from your colleagues</p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {shoutouts.map((shoutout) => (
              <div key={shoutout.id} className="p-6">
                {/* Shoutout Header */}
                <div className="mb-4">
                  <p className="font-semibold text-gray-800">
                    {shoutout.sender} → {shoutout.recipient}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{shoutout.timestamp}</p>
                </div>

                {/* Shoutout Message */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
                  <p className="text-gray-800 italic">"{shoutout.message}"</p>
                </div>

                {/* Reactions */}
                <div className="flex items-center space-x-6 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">👍</span>
                    <span className="text-gray-800 font-medium">{shoutout.reactions.like}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">👏</span>
                    <span className="text-gray-800 font-medium">{shoutout.reactions.clap}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">⭐</span>
                    <span className="text-gray-800 font-medium">{shoutout.reactions.star}</span>
                  </div>
                </div>

                {/* Comments */}
                {shoutout.comments.length > 0 && (
                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="font-medium text-gray-700 mb-3">Comments:</h4>
                    {shoutout.comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-3 mb-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-gray-800">{comment.user}</span>
                          <span className="text-sm text-gray-500">{comment.timestamp}</span>
                        </div>
                        <p className="text-gray-700">{comment.message}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment (Static) */}
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                      Post
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;