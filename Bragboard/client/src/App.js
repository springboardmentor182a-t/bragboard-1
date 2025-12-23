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
import ChangePassword from "./features/authentication/pages/ChangePassword";

import DashboardLayout from "./components/Layout/DashboardLayout";

import PrivateRoute from "./components/PrivateRoute";
import React from 'react';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* Default route */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/change-password" element={<ChangePassword />} />

          {/* Protected dashboard */}
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
