import React, { useState, useMemo } from 'react';
import StatsCards from '../components/Dashboard/StatsCards';
import Leaderboard from '../components/Dashboard/Leaderboard';
import DepartmentStats from '../components/Dashboard/DepartmentStats';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [viewFilter, setViewFilter] = useState('all'); // 'all', 'toMe', 'fromMe'
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'department'
  const [shoutouts, setShoutouts] = useState([
    {
      id: 1,
      sender: "John Smith",
      senderDept: "Marketing",
      recipient: "Jane Doe",
      recipientDept: "Software Engineering",
      message: "Awesome work on the Q3 Project! Your attention to detail really made the difference.",
      timestamp: "2 hours ago",
      reactions: { like: 5, clap: 3, star: 2 },
      comments: [
        { id: 1, user: "Mike Chen", message: "Absolutely! Jane was amazing!", timestamp: "1 hour ago" }
      ]
    },
    {
      id: 2,
      sender: "Jane Doe",
      senderDept: "Software Engineering",
      recipient: "Mike Chen",
      recipientDept: "Software Engineering",
      message: "Thanks for helping me with that bug fix! You're a lifesaver!",
      timestamp: "3 hours ago",
      reactions: { like: 3, clap: 6, star: 1 },
      comments: []
    },
    {
      id: 3,
      sender: "Sarah Lee",
      senderDept: "Product",
      recipient: "Team Alpha",
      recipientDept: "Product",
      message: "Crushed those deadlines! Incredible teamwork everyone!",
      timestamp: "4 hours ago",
      reactions: { like: 8, clap: 4, star: 1 },
      comments: []
    },
    {
      id: 4,
      sender: "Alex Johnson",
      senderDept: "Sales",
      recipient: "Jane Doe",
      recipientDept: "Software Engineering",
      message: "Your presentation today was outstanding! Really inspired the team.",
      timestamp: "6 hours ago",
      reactions: { like: 7, clap: 2, star: 4 },
      comments: []
    },
    {
      id: 5,
      sender: "Jane Doe",
      senderDept: "Software Engineering",
      recipient: "Team Engineering",
      recipientDept: "Software Engineering",
      message: "Great job everyone on the deployment! The new features are live and working perfectly.",
      timestamp: "1 day ago",
      reactions: { like: 12, clap: 8, star: 3 },
      comments: []
    },
    {
      id: 6,
      sender: "David Kim",
      senderDept: "HR",
      recipient: "Sarah Lee",
      recipientDept: "Product",
      message: "Excellent leadership on the new initiative! The team's morale is at an all-time high.",
      timestamp: "1 day ago",
      reactions: { like: 9, clap: 5, star: 2 },
      comments: []
    },
    {
      id: 7,
      sender: "Lisa Wong",
      senderDept: "Finance",
      recipient: "Team Marketing",
      recipientDept: "Marketing",
      message: "The campaign results exceeded all expectations! Fantastic work on the creative strategy.",
      timestamp: "2 days ago",
      reactions: { like: 15, clap: 7, star: 4 },
      comments: []
    }
  ]);
  const [userReactions, setUserReactions] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [editingComment, setEditingComment] = useState(null);

  const handleReaction = (shoutoutId, reactionType) => {
    const userKey = `${user.name}-${shoutoutId}`;
    const currentUserReactions = userReactions[userKey] || {};
    const hasReacted = currentUserReactions[reactionType];

    setShoutouts(prev => prev.map(shoutout => {
      if (shoutout.id === shoutoutId) {
        const newReactions = { ...shoutout.reactions };
        if (hasReacted) {
          // Remove reaction
          newReactions[reactionType] = Math.max(0, newReactions[reactionType] - 1);
        } else {
          // Add reaction
          newReactions[reactionType] = newReactions[reactionType] + 1;
        }
        return { ...shoutout, reactions: newReactions };
      }
      return shoutout;
    }));

    // Update user's reactions
    setUserReactions(prev => ({
      ...prev,
      [userKey]: {
        ...currentUserReactions,
        [reactionType]: !hasReacted
      }
    }));
  };

  const getReactionEmoji = (type) => {
    switch (type) {
      case 'like': return '👍';
      case 'clap': return '👏';
      case 'star': return '⭐';
      default: return '';
    }
  };

  const handleAddComment = (shoutoutId) => {
    const commentText = commentInputs[shoutoutId]?.trim();
    if (!commentText) return;

    const newComment = {
      id: Date.now(),
      user: user.name,
      message: commentText,
      timestamp: "Just now"
    };

    setShoutouts(prev => prev.map(shoutout =>
      shoutout.id === shoutoutId
        ? { ...shoutout, comments: [...shoutout.comments, newComment] }
        : shoutout
    ));

    setCommentInputs(prev => ({ ...prev, [shoutoutId]: '' }));
  };

  const handleEditComment = (shoutoutId, commentId, newMessage) => {
    setShoutouts(prev => prev.map(shoutout =>
      shoutout.id === shoutoutId
        ? {
            ...shoutout,
            comments: shoutout.comments.map(comment =>
              comment.id === commentId
                ? { ...comment, message: newMessage, timestamp: "Edited just now" }
                : comment
            )
          }
        : shoutout
    ));
    setEditingComment(null);
  };

  const handleDeleteComment = (shoutoutId, commentId) => {
    setShoutouts(prev => prev.map(shoutout =>
      shoutout.id === shoutoutId
        ? { ...shoutout, comments: shoutout.comments.filter(comment => comment.id !== commentId) }
        : shoutout
    ));
  };

  const startEditing = (commentId) => {
    setEditingComment(commentId);
  };

  const cancelEditing = () => {
    setEditingComment(null);
  };

  // Filter and sort shoutouts based on current view - optimized with useMemo
  const filteredShoutouts = useMemo(() => {
    let filtered;
    switch (viewFilter) {
      case 'toMe':
        filtered = shoutouts.filter(shoutout => shoutout.recipient === user.name);
        break;
      case 'fromMe':
        filtered = shoutouts.filter(shoutout => shoutout.sender === user.name);
        break;
      default:
        filtered = shoutouts.filter(shoutout =>
          shoutout.sender === user.name || shoutout.recipient === user.name
        );
    }

    // Sort based on sortBy
    if (sortBy === 'department') {
      return [...filtered].sort((a, b) => {
        const deptA = viewFilter === 'toMe' ? a.senderDept : a.recipientDept;
        const deptB = viewFilter === 'toMe' ? b.senderDept : b.recipientDept;
        return deptA.localeCompare(deptB);
      });
    }

    // Default: sort by recent (id descending for demo purposes)
    return [...filtered].sort((a, b) => b.id - a.id);
  }, [shoutouts, viewFilter, sortBy, user.name]);

  return (
    <div className="w-full max-w-full overflow-hidden">

      {/* Fixed Header (Spacing fixed here) */}
      <div className="sticky top-0 z-10 bg-white pt-1 pb-3 border-b border-gray-200 -mx-6 px-6">
        <h1 className="text-2xl font-bold text-gray-800">Employee Dashboard</h1>
      </div>

      <div className="pt-2">
        <StatsCards />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mt-6">
          <Leaderboard />
          <DepartmentStats />
        </div>

        {/* Shoutout Feed */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">My Shout-Outs</h2>
                <p className="text-gray-600 mt-1">Recognition involving you</p>
              </div>

              {/* Sort Controls */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    aria-label="Sort shoutouts by"
                  >
                    <option value="recent">Recent</option>
                    <option value="department">Department</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewFilter('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewFilter === 'all'
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                All ({shoutouts.filter(s => s.sender === user.name || s.recipient === user.name).length})
              </button>
              <button
                onClick={() => setViewFilter('toMe')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewFilter === 'toMe'
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                To Me ({shoutouts.filter(s => s.recipient === user.name).length})
              </button>
              <button
                onClick={() => setViewFilter('fromMe')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewFilter === 'fromMe'
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                From Me ({shoutouts.filter(s => s.sender === user.name).length})
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredShoutouts.map((shoutout) => (
              <div key={shoutout.id} className="p-6">

                <div className="mb-4">
                  <p className="font-semibold text-gray-800">
                    {shoutout.sender} → {shoutout.recipient}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{shoutout.timestamp}</p>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
                  <p className="text-gray-800 italic">"{shoutout.message}"</p>
                </div>

                <div className="flex items-center space-x-6 mb-4">
                  {['like', 'clap', 'star'].map((reactionType) => {
                    const userKey = `${user.name}-${shoutout.id}`;
                    const hasReacted = userReactions[userKey]?.[reactionType];
                    return (
                      <button
                        key={reactionType}
                        onClick={() => handleReaction(shoutout.id, reactionType)}
                        className={`flex items-center space-x-2 px-3 py-1 rounded-full transition-colors ${
                          hasReacted
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            : 'hover:bg-gray-100 text-gray-600'
                        }`}
                      >
                        <span className="text-lg">{getReactionEmoji(reactionType)}</span>
                        <span className="font-medium">{shoutout.reactions[reactionType]}</span>
                      </button>
                    );
                  })}
                </div>

                {shoutout.comments.length > 0 && (
                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="font-medium text-gray-700 mb-3">Comments:</h4>
                    {shoutout.comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-3 mb-2">
                        {editingComment === comment.id ? (
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-gray-800">Editing comment</span>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditComment(shoutout.id, comment.id, commentInputs[`edit-${comment.id}`] || comment.message)}
                                  className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={cancelEditing}
                                  className="text-xs bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                            <textarea
                              value={commentInputs[`edit-${comment.id}`] || comment.message}
                              onChange={(e) => setCommentInputs(prev => ({ ...prev, [`edit-${comment.id}`]: e.target.value }))}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              rows="2"
                            />
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-semibold text-gray-800">{comment.user}</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">{comment.timestamp}</span>
                                {comment.user === user.name && (
                                  <div className="flex space-x-1">
                                    <button
                                      onClick={() => startEditing(comment.id)}
                                      className="text-xs text-blue-600 hover:text-blue-800"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeleteComment(shoutout.id, comment.id)}
                                      className="text-xs text-red-600 hover:text-red-800"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                            <p className="text-gray-700">{comment.message}</p>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentInputs[shoutout.id] || ''}
                      onChange={(e) => setCommentInputs(prev => ({ ...prev, [shoutout.id]: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddComment(shoutout.id)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      aria-label="Add a comment"
                    />
                    <button
                      onClick={() => handleAddComment(shoutout.id)}
                      disabled={!commentInputs[shoutout.id]?.trim()}
                      className={`font-medium py-2 px-4 rounded-lg transition-colors ${
                        commentInputs[shoutout.id]?.trim()
                          ? 'bg-blue-500 hover:bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
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
