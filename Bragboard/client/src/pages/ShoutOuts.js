import React, { useState } from "react";

const ShoutOuts = () => {
  const [shoutouts, setShoutouts] = useState([
    {
      id: 1,
      sender: "John Smith",
      recipient: "Jane Doe",
      message:
        "Awesome work on the Q3 Project! Your attention to detail really made the difference.",
      timestamp: "2 hours ago",
      reactions: { like: 5, clap: 3, star: 2 },
      comments: [
        {
          user: "Mike Chen",
          message: "Absolutely! Jane was amazing!",
          timestamp: "1 hour ago",
        },
      ],
    },
    {
      id: 2,
      sender: "Sarah Lee",
      recipient: "Team Alpha",
      message: "Crushed those deadlines! Incredible teamwork everyone!",
      timestamp: "4 hours ago",
      reactions: { like: 8, clap: 4, star: 1 },
      comments: [],
    },
    {
      id: 3,
      sender: "Alex Rivera",
      recipient: "Marketing Team",
      message: "Great collaboration on the new campaign launch!",
      timestamp: "1 day ago",
      reactions: { like: 3, clap: 2, star: 0 },
      comments: [],
    },
  ]);

  const [newShoutout, setNewShoutout] = useState({
    recipient: "",
    message: "",
  });

  const handleSendShoutout = () => {
    if (newShoutout.recipient && newShoutout.message) {
      const shoutout = {
        id: shoutouts.length + 1,
        sender: "You",
        recipient: newShoutout.recipient,
        message: newShoutout.message,
        timestamp: "Just now",
        reactions: { like: 0, clap: 0, star: 0 },
        comments: [],
      };
      setShoutouts([shoutout, ...shoutouts]);
      setNewShoutout({ recipient: "", message: "" });
    }
  };

  const addReaction = (shoutoutId, reactionType) => {
    setShoutouts(
      shoutouts.map((shoutout) =>
        shoutout.id === shoutoutId
          ? {
              ...shoutout,
              reactions: {
                ...shoutout.reactions,
                [reactionType]: shoutout.reactions[reactionType] + 1,
              },
            }
          : shoutout
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Shout-Outs</h1>

      {/* Create New Shoutout */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Create New Shout-Out
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipient(s)
            </label>
            <input
              type="text"
              placeholder="Enter name or team"
              value={newShoutout.recipient}
              onChange={(e) =>
                setNewShoutout({ ...newShoutout, recipient: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Message
            </label>
            <textarea
              placeholder="Say something awesome about your colleague..."
              value={newShoutout.message}
              onChange={(e) =>
                setNewShoutout({ ...newShoutout, message: e.target.value })
              }
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleSendShoutout}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Send Shout-Out
          </button>
        </div>
      </div>

      {/* Shoutouts Feed */}
      <div className="space-y-6">
        {shoutouts.map((shoutout) => (
          <div
            key={shoutout.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            {/* Shoutout Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-semibold text-gray-800">
                  {shoutout.sender} → {shoutout.recipient}
                </p>
                <p className="text-sm text-gray-500">{shoutout.timestamp}</p>
              </div>
            </div>

            {/* Shoutout Message */}
            <p className="text-gray-700 mb-4 italic">"{shoutout.message}"</p>

            {/* Reactions */}
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={() => addReaction(shoutout.id, "like")}
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-500"
              >
                <span>👍</span>
                <span>{shoutout.reactions.like}</span>
              </button>
              <button
                onClick={() => addReaction(shoutout.id, "clap")}
                className="flex items-center space-x-1 text-gray-600 hover:text-green-500"
              >
                <span>👏</span>
                <span>{shoutout.reactions.clap}</span>
              </button>
              <button
                onClick={() => addReaction(shoutout.id, "star")}
                className="flex items-center space-x-1 text-gray-600 hover:text-yellow-500"
              >
                <span>⭐</span>
                <span>{shoutout.reactions.star}</span>
              </button>
            </div>

            {/* Comments */}
            {shoutout.comments.length > 0 && (
              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-medium text-gray-700 mb-2">Comments:</h4>
                {shoutout.comments.map((comment, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3 mb-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-800">
                        {comment.user}
                      </span>
                      <span className="text-sm text-gray-500">
                        {comment.timestamp}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.message}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                  Post
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShoutOuts;
