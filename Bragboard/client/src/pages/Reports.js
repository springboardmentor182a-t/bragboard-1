import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Analytics = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('week');

  // Mock data for analytics
  const analyticsData = {
    week: {
      shoutoutsSent: 12,
      reactionsReceived: 36,
      commentsMade: 8,
      topContributors: [
        { name: "John Smith", count: 15 },
        { name: "Mike Chen", count: 12 },
        { name: "Alex Rivera", count: 10 },
        { name: "Sarah Lee", count: 8 },
        { name: "You", count: 12 }
      ],
      departmentStats: [
        { department: "Engineering", shoutouts: 45 },
        { department: "Marketing", shoutouts: 28 },
        { department: "Sales", shoutouts: 32 },
        { department: "Design", shoutouts: 19 }
      ]
    },
    month: {
      shoutoutsSent: 42,
      reactionsReceived: 128,
      commentsMade: 35,
      topContributors: [
        { name: "John Smith", count: 58 },
        { name: "Mike Chen", count: 45 },
        { name: "You", count: 42 },
        { name: "Sarah Lee", count: 38 },
        { name: "Alex Rivera", count: 35 }
      ],
      departmentStats: [
        { department: "Engineering", shoutouts: 165 },
        { department: "Sales", shoutouts: 142 },
        { department: "Marketing", shoutouts: 98 },
        { department: "Design", shoutouts: 76 }
      ]
    },
    year: {
      shoutoutsSent: 480,
      reactionsReceived: 1520,
      commentsMade: 420,
      topContributors: [
        { name: "John Smith", count: 680 },
        { name: "Mike Chen", count: 520 },
        { name: "You", count: 480 },
        { name: "Sarah Lee", count: 450 },
        { name: "Alex Rivera", count: 420 }
      ],
      departmentStats: [
        { department: "Engineering", shoutouts: 1980 },
        { department: "Sales", shoutouts: 1680 },
        { department: "Marketing", shoutouts: 1250 },
        { department: "Design", shoutouts: 980 },
        { department: "HR", shoutouts: 650 }
      ]
    }
  };

  const currentData = analyticsData[timeRange];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-white pt-2 pb-4 border-b border-gray-200 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
          </div>
          
          {/* Time Range Selector */}
          <div className="flex space-x-2">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-4 py-2 rounded-lg font-medium ${
                timeRange === 'week'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-4 py-2 rounded-lg font-medium ${
                timeRange === 'month'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setTimeRange('year')}
              className={`px-4 py-2 rounded-lg font-medium ${
                timeRange === 'year'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              This Year
            </button>
          </div>
        </div>
      </div>

      <div className="pt-2">
        {/* Personal Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{currentData.shoutoutsSent}</p>
              <p className="text-gray-600">Shout-outs Sent</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{currentData.reactionsReceived}</p>
              <p className="text-gray-600">Reactions Received</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{currentData.commentsMade}</p>
              <p className="text-gray-600">Comments Made</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Contributors */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Contributors</h2>
            <div className="space-y-3">
              {currentData.topContributors.map((contributor, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 
                      index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                    }`}>
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <span className={`font-medium ${
                      contributor.name === "You" ? 'text-blue-600' : 'text-gray-800'
                    }`}>
                      {contributor.name}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">{contributor.count} shoutouts</span>
                </div>
              ))}
            </div>
          </div>

          {/* Department Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Department Performance</h2>
            <div className="space-y-4">
              {currentData.departmentStats.map((dept, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{dept.department}</span>
                    <span className="text-sm text-gray-600">{dept.shoutouts} shoutouts</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(dept.shoutouts / Math.max(...currentData.departmentStats.map(d => d.shoutouts))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* REMOVED: Time Range Summary Section */}
        {/* This section has been removed as requested */}

        {/* Export Options */}
        {user.role === 'admin' && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Export Analytics</h2>
            <div className="flex space-x-4">
              <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center space-x-2">
                <span>📊</span>
                <span>Export as CSV</span>
              </button>
              <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center space-x-2">
                <span>📄</span>
                <span>Export as PDF</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
