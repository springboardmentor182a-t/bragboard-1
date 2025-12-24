import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";

import Login from "./features/authentication/pages/Login";
import Signup from "./features/authentication/pages/Register";
import ForgotPassword from "./features/authentication/pages/ForgotPassword";
import VerifyOTP from "./features/authentication/pages/VerifyOTP";
import ChangePassword from "./features/authentication/pages/ChangePassword";import React, { useState, useEffect } from 'react';
const createShoutout = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
 const fetchShoutouts = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/shoutouts`);
      const data = await response.json();
      setShoutouts(data);
    } catch (error) {
      console.error('Error fetching shoutouts:', error);
    }
  };
import './App.css';
import ShoutoutItem from './Reactions';
function App() {
  const [shoutouts, setShoutouts] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchShoutouts();
  }, []);
import ChangePassword from "./features/authentication/pages/ChangePassword";
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
import DashboardLayout from "./components/Layout/DashboardLayout";
 setLoading(true);
    try {
      await fetch(`${API_BASE}/api/shoutouts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
         return (
    <div className="App">
      <h1>BragBoard</h1>

      <form onSubmit={createShoutout} className="shoutout-form">
      setMessage('');
      fetchShoutouts(); // Refresh list
    } catch (error) {
      console.error('Error creating shoutout:', error);
    } finally {
      setLoading(false);
    }
  };

import PrivateRoute from "./components/PrivateRoute";
import React from 'react';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
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
          {/* Default route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
<div className="shoutouts">
        {shoutouts.map(shoutout => (
          <ShoutoutItem
            key={shoutout.id}
            shoutout={shoutout}
            onRefresh={fetchShoutouts}
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/change-password" element={<ChangePassword />} />

          {/* Protected dashboard */}
 ))}
      </div>
    </div>
  );
}
export default App;
          <Route
            path="/dashboard/*"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          />

        </Routes>
      </Router>
    </AuthProvider>
