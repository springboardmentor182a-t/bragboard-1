import React from 'react';

const ShoutOutFeed = () => {
  const shoutouts = [
    {
      id: 1,
      sender: "John Smith",
      recipient: "Jane Doe",
      message: "Awesome work on the Q3 Project",
      type: "normal"
    },
    {
      id: 2,
      sender: "Sarah Lee",
      recipient: "Team Alpha",
      message: "Crushed those deadlines!",
      type: "ready"
    },
    {
      id: 3,
      sender: "BragBoard Bot",
      recipient: "All",
      message: "Remember to give kudos!",
      type: "reply"
    }
  ];

  const getHeaderColor = (type) => {
    switch (type) {
      case 'ready':
        return 'text-green-600';
      case 'reply':
        return 'text-blue-600';
      default:
        return 'text-gray-800';
    }
  };

  const getPrefix = (type) => {
    switch (type) {
      case 'ready':
        return 'Ready';
      case 'reply':
        return 'Reply';
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>

        <div className="space-y-6">
          {shoutouts.map((shoutout) => (
            <div key={shoutout.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
              {shoutout.type !== 'normal' && (
                <div className={`text-sm font-medium mb-2 ${getHeaderColor(shoutout.type)}`}>
                  {getPrefix(shoutout.type)}
                </div>
              )}

              <div className="flex items-start space-x-3">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 mb-1">
                    {shoutout.sender} &gt; {shoutout.recipient}:
                  </p>
                  <p className="text-gray-600 italic">"{shoutout.message}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShoutOutFeed;