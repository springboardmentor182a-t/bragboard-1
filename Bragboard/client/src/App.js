import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// --- Authentication pages (correct paths)
import Login from "./features/authentication/pages/Login";
import Register from "./features/authentication/pages/Register";
import ForgotPassword from "./features/authentication/pages/ForgotPassword";
import VerifyOTP from "./features/authentication/pages/VerifyOTP";
import ChangePassword from "./features/authentication/pages/ChangePassword";

// Example protected dashboard import (adjust path if different)
import Dashboard from "./features/dashboard/Dashboard";

// Example PrivateRoute (if you have one)
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/change-password" element={<ChangePassword />} />

        {/* Protected routes example */}
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        {/* Fallback */}
        <Route path="*" element={<div style={{ padding: 24 }}>Page not found</div>} />
      </Routes>
    </Router>
  );
}
