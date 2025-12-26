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
import './App.css';import Leaderboard from "./pages/Leaderboard";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🏆 Employee Leaderboard</h1>
        <p>Gamified recognition based on shout-outs & reactions</p>
      </header>

      <main className="app-content">
        <Leaderboard />
      </main>
    </div>
  );
}

export default App;
