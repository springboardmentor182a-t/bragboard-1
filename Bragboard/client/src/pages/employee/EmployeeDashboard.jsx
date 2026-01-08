import React, { useState, useMemo, useEffect } from 'react';
import StatsCards from '../../components/Dashboard/StatsCards';
import Leaderboard from '../../components/Dashboard/Leaderboard';
import DepartmentStats from '../../components/Dashboard/DepartmentStats';
import DashboardLayout from '../../components/Layout/DashboardLayout.jsx';
import { useAuth } from "../../Context/AuthContext";
import { shoutouts as shoutoutsApi, analytics, reports } from '../../services/api';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [viewFilter, setViewFilter] = useState('all'); // 'all', 'toMe', 'fromMe'
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'department'
  const [shoutouts, setShoutouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userReactions, setUserReactions] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [editingComment, setEditingComment] = useState(null);

  // Report Modal State
  const [reportModal, setReportModal] = useState({ isOpen: false, shoutoutId: null });
  const [reportReason, setReportReason] = useState('');

  // Analytics State
  const [stats, setStats] = useState({
    total_shoutouts: 0,
    total_reactions: 0,
    total_comments: 0
  });
  const [contributors, setContributors] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [shoutoutsRes, overviewRes, contributorsRes, deptRes] = await Promise.all([
        shoutoutsApi.getAll(),
        analytics.getOverview(),
        analytics.getTopContributors(5),
        analytics.getDepartmentStats()
      ]);

      // Process shoutouts
      const formattedShoutouts = shoutoutsRes.data.map(s => ({
        id: s.id,
        sender: s.sender_name || s.sender?.name || 'Unknown',
        senderDept: s.sender?.department || 'General',
        recipients: s.recipients.map(r => r.recipient_name || r.name),
        recipientDisplay: s.recipients.map(r => r.recipient_name || r.name).join(', '),
        recipientDept: s.recipients[0]?.department || 'General',
        message: s.message,
        timestamp: new Date(s.created_at).toLocaleString(),
        reactions: s.reaction_counts || processReactions(s.reactions), // Use reaction_counts if available?? No, processReactions handles list. Wait.
        comments: (s.comments || []).map(c => ({
          id: c.id,
          user: c.user_name || c.user?.name || 'Unknown',
          message: c.content,
          timestamp: new Date(c.created_at).toLocaleString()
        }))
      }));
      setShoutouts(formattedShoutouts);

      // Populate user reactions state from API
      const initialUserReactions = {};
      if (user) {
        shoutoutsRes.data.forEach(s => {
          if (s.user_reactions && s.user_reactions.length > 0) {
            const userKey = `${user.name}-${s.id}`;
            const reactionsState = { like: false, clap: false, star: false };
            s.user_reactions.forEach(type => {
              reactionsState[type] = true;
            });
            initialUserReactions[userKey] = reactionsState;
          }
        });
        setUserReactions(prev => ({ ...prev, ...initialUserReactions }));
      }

      // Process contributors data to ensure names are properly handled
      const processedContributors = (contributorsRes.data || []).map(contributor => ({
        ...contributor,
        // Use the most appropriate name field available
        name: contributor.name || contributor.employee_name || contributor.sender_name ||
          (contributor.employee_id ? `Employee #${contributor.employee_id}` : 'Unknown')
      }));

      // Set Analytics
      setStats(overviewRes.data);
      setContributors(processedContributors);
      setDepartments(deptRes.data);

      // Log data for debugging
      console.log('Processed contributors:', processedContributors);

    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
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
    if (user?.role !== 'admin') return;
    if (window.confirm("Are you sure you want to delete this shoutout?")) {
      try {
        await shoutoutsApi.delete(shoutoutId);
        setShoutouts(prev => prev.filter(s => s.id !== shoutoutId));
        // Update stats immediately
        setStats(prev => ({ ...prev, total_shoutouts: Math.max(0, prev.total_shoutouts - 1) }));
        alert("Shout-out is deleted successfully");
      } catch (error) {
        console.error("Failed to delete shoutout", error);
        alert("Failed to delete shoutout");
      }
    }
  }


  const handleReport = async () => {
    if (!reportReason.trim()) return;
    try {
      await reports.create({
        shoutout_id: reportModal.shoutoutId,
        reason: reportReason
      });
      alert("Report submitted successfully.");
      setReportModal({ isOpen: false, shoutoutId: null });
      setReportReason('');
    } catch (error) {
      console.error("Failed to submit report", error);
      alert("Failed to submit report.");
    }
  };

  const handleReaction = async (shoutoutId, reactionType) => {
    const userKey = user ? `${user.name}-${shoutoutId}` : `guest-${shoutoutId}`;
    const currentUserReactions = userReactions[userKey] || {};
    const hasReacted = currentUserReactions[reactionType];

    // Optimistically update UI
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

    // Update user's reactions state locally
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

    // Call API to persist change
    if (user) {
      try {
        await shoutoutsApi.toggleReaction(shoutoutId, reactionType);
      } catch (error) {
        console.error("Failed to toggle reaction:", error);
        // Ideally revert optimistic update here, but for now just log
      }
    }
  };

  const getReactionEmoji = (type) => {
    switch (type) {
      case 'like': return '👍';
      case 'clap': return '👏';
      case 'star': return '⭐';
      default: return '';
    }
  };

  const handleAddComment = async (shoutoutId) => {
    const commentText = commentInputs[shoutoutId]?.trim();
    if (!commentText) return;

    // Optimistic Update
    const tempId = Date.now();
    const newComment = {
      id: tempId,
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

    // API Call
    try {
      await shoutoutsApi.addComment(shoutoutId, { content: commentText });
      // In a real app we might replace the temp comment with the real one from response,
      // but for now, simple persistence is the goal.
    } catch (error) {
      console.error("Failed to add comment", error);
      // Revert optimistic update on failure
      setShoutouts(prev => prev.map(shoutout =>
        shoutout.id === shoutoutId
          ? { ...shoutout, comments: shoutout.comments.filter(c => c.id !== tempId) }
          : shoutout
      ));
      alert("Failed to post comment. Please try again.");
    }
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
    // ... existing logic ...
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



  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="w-full max-w-full overflow-hidden">
        {/* ... stats ... */}
        {/* Header with gray gap */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6 text-center transition-colors duration-200">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {user?.role === 'admin' ? 'Admin Dashboard' : 'Employee Dashboard'}
          </h1>
        </div>

        <div className="pt-2">
          <StatsCards stats={stats} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mt-6">
            <Leaderboard leaders={contributors} />
            <DepartmentStats departments={departments} />
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
                    <div className="flex items-center space-x-2">
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

                      <button
                        onClick={() => setReportModal({ isOpen: true, shoutoutId: shoutout.id })}
                        className="text-gray-400 hover:text-yellow-500 dark:text-gray-500 dark:hover:text-yellow-400 transition-colors p-1"
                        title="Report this shoutout"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </button>
                    </div>
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
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed' // This one might need dark mode too but technically gray-200 is ok for disabled
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

      {reportModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Report Shoutout</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Please provide a reason for reporting this shoutout.</p>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 mb-4 bg-white dark:bg-gray-700 dark:text-white"
              rows="3"
              placeholder="Reason..."
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setReportModal({ isOpen: false, shoutoutId: null })}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                disabled={!reportReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
