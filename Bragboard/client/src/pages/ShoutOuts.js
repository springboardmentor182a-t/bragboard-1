import React, { useState } from 'react';

const ShoutOuts = () => {
  const [newShoutout, setNewShoutout] = useState({
    recipient: '',
    message: ''
  });

  const teamMembers = [
    "John Smith",
    "Sarah Lee",
    "Mike Chen",
    "Alex Johnson",
    "Jane Doe",
    "Team Alpha",
    "Team Engineering",
    "Team Marketing"
  ];

  const handleSendShoutout = (e) => {
    e.preventDefault();
    
    if (newShoutout.recipient.trim() && newShoutout.message.trim()) {
      // In a real app, this would send to backend
      console.log('Shoutout sent:', {
        recipient: newShoutout.recipient,
        message: newShoutout.message
      });
      
      // Show success message
      alert(`Shoutout sent to ${newShoutout.recipient}!`);
      
      // Reset form
      setNewShoutout({ recipient: '', message: '' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-white pt-2 pb-4 border-b border-gray-200 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Shout-Outs</h1>
            <p className="text-sm text-gray-600 mt-1">Recognize and celebrate achievements</p>
          </div>
        </div>
      </div>

      {/* Main Content - Only Form */}
      <div className="pt-2">
        {/* Create New Shoutout Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Create New Shout-Out</h2>
          <form onSubmit={handleSendShoutout}>
            <div className="space-y-6">
              {/* Recipient Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Who would you like to recognize?
                </label>
                <select
                  value={newShoutout.recipient}
                  onChange={(e) => setNewShoutout({...newShoutout, recipient: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a colleague or team</option>
                  {teamMembers.map((member, index) => (
                    <option key={index} value={member}>{member}</option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-2">
                  Choose a colleague or team to recognize their great work
                </p>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recognition Message
                </label>
                <textarea
                  placeholder="Say something awesome about your colleague or team..."
                  value={newShoutout.message}
                  onChange={(e) => setNewShoutout({...newShoutout, message: e.target.value})}
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Be specific about what they did and why it mattered
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newShoutout.recipient.trim() || !newShoutout.message.trim()}
                  className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                    newShoutout.recipient.trim() && newShoutout.message.trim()
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Send Shout-Out
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShoutOuts;