import React from 'react';

const StatsCards = () => {
  const stats = [
    {
      value: '12',
      label: 'Shout-outs Sent'
    },
    {
      value: '36',
      label: 'Reactions Received'
    },
    {
      value: '8',
      label: 'Comments Made'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <p className={`text-3xl font-bold mb-2 ${stat.label === 'Comments Made' ? 'text-blue-600' : 'text-gray-800'}`}>{stat.value}</p>
            <p className="text-gray-600 font-medium text-sm">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
