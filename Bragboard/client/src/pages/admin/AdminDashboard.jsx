import React, { useEffect, useState, useMemo } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout.jsx';
import { analytics, shoutouts as shoutoutsApi } from '../../services/api';
import { useAuth } from "../../Context/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();

  // Analytics State
  const [stats, setStats] = useState({
    total_shoutouts: 0,
    total_reactions: 0,
    total_comments: 0
  });
  const [contributors, setContributors] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Feed State
  const [activeTab, setActiveTab] = useState('dashboard'); // Not really used for AdminDashboard internally but for layout
  const [viewFilter, setViewFilter] = useState('all'); // 'all', 'toMe', 'fromMe'
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'department'
  const [shoutouts, setShoutouts] = useState([]);
  const [userReactions, setUserReactions] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [editingComment, setEditingComment] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewRes, contributorsRes, deptRes] = await Promise.all([
          analytics.getOverview(),
          analytics.getTopContributors(5),
          analytics.getDepartmentStats()
        ]);

        setStats(overviewRes.data);
        setContributors(contributorsRes.data);
        setDepartments(deptRes.data);
      } catch (error) {
        console.error("Error fetching admin dashboard analytics:", error);
      }
    };

    fetchData();
    fetchShoutouts();
  }, []);

  const fetchShoutouts = async () => {
    try {
      const response = await shoutoutsApi.getAll();
      const formattedShoutouts = response.data.map(s => ({
        id: s.id,
        sender: s.sender?.name || 'Unknown',
        senderDept: s.sender?.department || 'General',
        recipients: s.recipients.map(r => r.name), // Array for logic
        recipientDisplay: s.recipients.map(r => r.name).join(', '), // String for display
        recipientDept: s.recipients[0]?.department || 'General',
        message: s.message,
        timestamp: new Date(s.created_at).toLocaleString(),
        reactions: processReactions(s.reactions),
        comments: s.comments.map(c => ({
          id: c.id,
          user: c.user?.name || 'Unknown',
          message: c.text,
          timestamp: new Date(c.created_at).toLocaleString()
        }))
      }));
      setShoutouts(formattedShoutouts);
    } catch (error) {
      console.error("Failed to fetch shoutouts", error);
    } finally {
      setLoading(false);
    }
  };

  const processReactions = (reactionsList) => {
    const counts = { like: 0, clap: 0, star: 0 };
    if (!reactionsList) return counts;
    reactionsList.forEach(r => {
      if (counts[r.type] !== undefined) counts[r.type]++;
    });
    return counts;
  };

  // Delete shoutout (Admin only)
  const handleDeleteShoutout = async (shoutoutId) => {
    // Already in Admin Dashboard, but check role just in case
    if (user?.role !== 'admin') return;

    if (window.confirm("Are you sure you want to delete this shoutout?")) {
      try {
        await shoutoutsApi.delete(shoutoutId);
        setShoutouts(prev => prev.filter(s => s.id !== shoutoutId));
      } catch (error) {
        console.error("Failed to delete shoutout", error);
        alert("Failed to delete shoutout");
      }
    }
  };

  const handleReaction = (shoutoutId, reactionType) => {
    const userKey = user ? `${user.name}-${shoutoutId}` : `guest-${shoutoutId}`;
    const currentUserReactions = userReactions[userKey] || {};
    const hasReacted = currentUserReactions[reactionType];

    setShoutouts(prev => prev.map(shoutout => {
      if (shoutout.id === shoutoutId) {
        const newReactions = { ...shoutout.reactions };

        if (hasReacted) {
          // Flatten: Remove reaction
          newReactions[reactionType] = Math.max(0, newReactions[reactionType] - 1);
        } else {
          // Mutually Exclusive: Remove ANY existing reaction first
          const oldReactionType = Object.keys(currentUserReactions).find(type => currentUserReactions[type]);
          if (oldReactionType) {
            newReactions[oldReactionType] = Math.max(0, newReactions[oldReactionType] - 1);
          }
          // Then add new one
          newReactions[reactionType] = newReactions[reactionType] + 1;
        }
        return { ...shoutout, reactions: newReactions };
      }
      return shoutout;
    }));

    // Update user's reactions state
    setUserReactions(prev => {
      const newUserReactions = { ...currentUserReactions };

      if (hasReacted) {
        // Toggle off
        newUserReactions[reactionType] = false;
      } else {
        // Clear all, set new
        ['like', 'clap', 'star'].forEach(type => {
          newUserReactions[type] = (type === reactionType);
        });
      }

      return {
        ...prev,
        [userKey]: newUserReactions
      };
    });
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
        filtered = shoutouts.filter(shoutout => shoutout.recipients.includes(user.name));
        break;
      case 'fromMe':
        filtered = shoutouts.filter(shoutout => shoutout.sender === user.name);
        break;
      default:
        filtered = shoutouts;
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
    const sorted = [...filtered].sort((a, b) => b.id - a.id);
    return sorted;
  }, [shoutouts, viewFilter, sortBy, user.name]);


  const statCards = [
    { label: 'Shout-outs Sent', value: stats.total_shoutouts },
    { label: 'Reactions Received', value: stats.total_reactions },
    { label: 'Comments Made', value: stats.total_comments },
  ];

  return (
    <DashboardLayout>
      <div className="p-8 min-h-screen transition-colors duration-200">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8 transition-colors duration-200">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm text-center transition-colors duration-200">
              <p className="text-4xl font-bold text-gray-800 dark:text-white mb-2">{stat.value}</p>
              <p className="text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

          {/* Top Contributors */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm transition-colors duration-200">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Top Contributors</h2>
            <div className="space-y-4">
              {contributors.map((c, index) => (
                <div key={c.employee_id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-400' : 'bg-blue-400'} flex items-center justify-center text-white font-bold`}>
                      {index + 1}
                    </div>
                    {/* Note: backend returns 'employee_id' currently */}
                    <span className="font-medium text-gray-800 dark:text-gray-200">Employee #{c.employee_id}</span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{c.sent_shoutouts} shoutouts</span>
                </div>
              ))}
              {contributors.length === 0 && <p className="text-gray-500">No contributors yet.</p>}
            </div>
          </div>

          {/* Department Performance */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm transition-colors duration-200">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Department Performance</h2>
            <div className="space-y-5">
              {departments.map((d, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300 font-medium">{d.department || 'Unassigned'}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">{d.employees} employees</span>
                </div>
              ))}
              {departments.length === 0 && <p className="text-gray-500">No department data.</p>}
            </div>
          </div>
        </div>

        {/* Shoutout Feed */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mt-6 transition-colors duration-200">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">My Shout-Outs</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Recognition involving you</p>
              </div>

              {/* Sort Controls */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                    aria-label="Sort shoutouts by"
                  >
                    <option value="recent">Recent</option>
                    <option value="department">Department</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              <button
                onClick={() => setViewFilter('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewFilter === 'all'
                  ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
              >
                All ({shoutouts.length})
              </button>
              <button
                onClick={() => setViewFilter('toMe')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewFilter === 'toMe'
                  ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
              >
                To Me ({shoutouts.filter(s => s.recipients.includes(user.name)).length})
              </button>
              <button
                onClick={() => setViewFilter('fromMe')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewFilter === 'fromMe'
                  ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
              >
                From Me ({shoutouts.filter(s => s.sender === user.name).length})
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredShoutouts.map((shoutout) => (
              <div key={shoutout.id} className="p-6">

                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {shoutout.sender} → {shoutout.recipientDisplay}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{shoutout.timestamp}</p>
                  </div>
                  {user?.role === 'admin' && (
                    <button
                      onClick={() => handleDeleteShoutout(shoutout.id)}
                      className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors p-1"
                      title="Delete Shoutout (Admin only)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4 mb-4">
                  <p className="text-gray-800 dark:text-blue-100 italic">"{shoutout.message}"</p>
                </div>

                <div className="flex items-center space-x-6 mb-4">
                  {['like', 'clap', 'star'].map((reactionType) => {
                    const userKey = user ? `${user.name}-${shoutout.id}` : `guest-${shoutout.id}`;
                    const hasReacted = userReactions[userKey]?.[reactionType];
                    return (
                      <button
                        key={reactionType}
                        onClick={() => user && handleReaction(shoutout.id, reactionType)}
                        className={`flex items-center space-x-2 px-3 py-1 rounded-full transition-colors ${hasReacted
                          ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                          }`}
                        title={`${reactionType} (${shoutout.reactions[reactionType]})`}
                      >
                        <span className="text-lg">{getReactionEmoji(reactionType)}</span>
                        <span className="font-medium">{shoutout.reactions[reactionType]}</span>
                      </button>
                    );
                  })}
                </div>

                {shoutout.comments.length > 0 && (
                  <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Comments:</h4>
                    {shoutout.comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 mb-2">
                        {editingComment === comment.id ? (
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-gray-800 dark:text-white">Editing comment</span>
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
                              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 dark:text-white"
                              rows="2"
                            />
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-semibold text-gray-800 dark:text-gray-200">{comment.user}</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500 dark:text-gray-400">{comment.timestamp}</span>
                                {comment.user === user.name && (
                                  <div className="flex space-x-1">
                                    <button
                                      onClick={() => startEditing(comment.id)}
                                      className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeleteComment(shoutout.id, comment.id)}
                                      className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">{comment.message}</p>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentInputs[shoutout.id] || ''}
                      onChange={(e) => setCommentInputs(prev => ({ ...prev, [shoutout.id]: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddComment(shoutout.id)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                      aria-label="Add a comment"
                    />
                    <button
                      onClick={() => handleAddComment(shoutout.id)}
                      disabled={!commentInputs[shoutout.id]?.trim()}
                      className={`font-medium py-2 px-4 rounded-lg transition-colors ${commentInputs[shoutout.id]?.trim()
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
    </DashboardLayout>
  );
};

export default AdminDashboard;
