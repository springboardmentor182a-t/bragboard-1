import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";

import Login from "./features/authentication/pages/Login";
import Signup from "./features/authentication/pages/Register";
import ForgotPassword from "./features/authentication/pages/ForgotPassword";
import VerifyOTP from "./features/authentication/pages/VerifyOTP";
import ChangePassword from "./features/authentication/pages/ChangePassword";import React, { useState, useEffect } from 'react';
import './App.css';
import ShoutoutItem from './Reactions';
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

import PrivateRoute from "./components/PrivateRoute";import React from 'react';
import './App.css';
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
  return (
        <AuthProvider>
      <Router>
        <Routes>

          {/* Default route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
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
            onRefresh={fetchShoutouts}
          />

        </Routes>
      </Router>

    <div className="App">
      <header className="App-header">
        <h1>Welcome to Comment API</h1>
        <p>This is a React application for managing comments.</p>
      </header>
        ))}
      </div>
    </div>
  );
}
export default App;
