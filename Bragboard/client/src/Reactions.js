import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8000';

const handleReaction = async (shoutoutId, type, currentUserReaction) => {
  try {
    if (currentUserReaction === type) {
      // Remove reaction
      await fetch(`${API_BASE}/api/shoutouts/${shoutoutId}/reactions`, {
        method: 'DELETE'
      });
    } else {
      // Add or update reaction
      await fetch(`${API_BASE}/api/shoutouts/${shoutoutId}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      });
    }
  } catch (error) {
    console.error('Error handling reaction:', error);
    throw error;
  }
};

const fetchReactions = async (shoutoutId) => {
  try {
    const response = await fetch(`${API_BASE}/api/shoutouts/${shoutoutId}/reactions`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching reactions:', error);
    return { counts: {}, user_reaction: null };
  }
};

function ShoutoutItem({ shoutout, onRefresh }) {
  const [reactions, setReactions] = useState({ counts: {}, user_reaction: null });
  useEffect(() => {
    const loadReactions = async () => {
      const data = await fetchReactions(shoutout.id);
      setReactions(data);
    };
    loadReactions();
  }, [shoutout.id]);

  const reactionTypes = ['like', 'clap', 'star'];

  const onReactionClick = async (type) => {
    try {
      await handleReaction(shoutout.id, type, reactions.user_reaction);
      // Refresh reactions after change
      const data = await fetchReactions(shoutout.id);
      setReactions(data);
      // Notify parent to refresh shoutouts list
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error updating reaction:', error);
    }
  };

  return (
    <div className="shoutout-item">
      <p>{shoutout.message}</p>
      <small>{new Date(shoutout.created_at).toLocaleString()}</small>

      <div className="reactions">
        {reactionTypes.map(type => (
          <button
            key={type}
            onClick={() => onReactionClick(type)}
            className={reactions.user_reaction === type ? 'active' : ''}
          >
            {type} ({reactions.counts[type] || 0})
          </button>
        ))}
      </div>
    </div>
  );
}
export default ShoutoutItem;
