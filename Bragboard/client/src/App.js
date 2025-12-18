import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE = 'http://localhost:8000';

function App() {
  const [shoutouts, setShoutouts] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchShoutouts();
  }, []);

  const fetchShoutouts = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/shoutouts`);
      const data = await response.json();
      setShoutouts(data);
    } catch (error) {
      console.error('Error fetching shoutouts:', error);
    }
  };

  const createShoutout = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      await fetch(`${API_BASE}/api/shoutouts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      setMessage('');
      fetchShoutouts(); // Refresh list
    } catch (error) {
      console.error('Error creating shoutout:', error);
    } finally {
      setLoading(false);
    }
  };

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
      // Refresh shoutouts to update reactions
      fetchShoutouts();
    } catch (error) {
      console.error('Error handling reaction:', error);
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

  return (
    <div className="App">
      <h1>BragBoard</h1>

      <form onSubmit={createShoutout} className="shoutout-form">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Share your shoutout..."
          rows="3"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Posting...' : 'Post Shoutout'}
        </button>
      </form>

      <div className="shoutouts">
        {shoutouts.map(shoutout => (
          <ShoutoutItem
            key={shoutout.id}
            shoutout={shoutout}
            onReaction={handleReaction}
            fetchReactions={fetchReactions}
          />
        ))}
      </div>
    </div>
  );
}

function ShoutoutItem({ shoutout, onReaction, fetchReactions }) {
  const [reactions, setReactions] = useState({ counts: {}, user_reaction: null });

  useEffect(() => {
    const loadReactions = async () => {
      const data = await fetchReactions(shoutout.id);
      setReactions(data);
    };
    loadReactions();
  }, [shoutout.id, fetchReactions]);

  const reactionTypes = ['like', 'clap', 'star'];

  return (
    <div className="shoutout-item">
      <p>{shoutout.message}</p>
      <small>{new Date(shoutout.created_at).toLocaleString()}</small>

      <div className="reactions">
        {reactionTypes.map(type => (
          <button
            key={type}
            onClick={() => onReaction(shoutout.id, type, reactions.user_reaction)}
            className={reactions.user_reaction === type ? 'active' : ''}
          >
            {type} ({reactions.counts[type] || 0})
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
