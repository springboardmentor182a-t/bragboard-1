import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';

const Reports = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('week');

  const reportData = {
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
    }
  };

  const currentData = reportData[timeRange];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Analytics & Reports</h1>

        <div className="flex space-x-2">
          {["week", "month"].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium ${timeRange === range
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              {range === "week" ? "This Week" : "This Month"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Shout-outs Sent", value: currentData.shoutoutsSent },
          { label: "Reactions Received", value: currentData.reactionsReceived },
          { label: "Comments Made", value: currentData.commentsMade }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow border text-center">
            <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
            <p className="text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="font-semibold mb-4">Top Contributors</h2>
          {currentData.topContributors.map((c, i) => (
            <div key={i} className="flex justify-between bg-gray-50 p-3 rounded mb-2">
              <span className={c.name === "You" ? "text-blue-600 font-medium" : ""}>
                {i + 1}. {c.name}
              </span>
              <span>{c.count}</span>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="font-semibold mb-4">Department Performance</h2>
          {currentData.departmentStats.map((d, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between text-sm">
                <span>{d.department}</span>
                <span>{d.shoutouts}</span>
              </div>
              <div className="bg-gray-200 h-2 rounded">
                <div
                  className="bg-blue-500 h-2 rounded"
                  style={{
                    width: `${(d.shoutouts /
                      Math.max(...currentData.departmentStats.map(x => x.shoutouts))) * 100}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {user.role === 'admin' && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow border">
          <h2 className="font-semibold mb-4">Export Reports</h2>
          <div className="flex space-x-4">
            <button className="bg-green-500 text-white px-6 py-2 rounded">Export CSV</button>
            <button className="bg-red-500 text-white px-6 py-2 rounded">Export PDF</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
