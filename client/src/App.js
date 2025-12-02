// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./lib/authContext";
import BrandBadge from "./components/Common/BrandBadge";

import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import OTPVerify from "./components/Auth/OTPVerify";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";

import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmpDashboard";
import Shoutouts from "./pages/Shoutouts";

import "./index.css";

function App() {
  return (
    <AuthProvider>
      <BrandBadge />
      <BrowserRouter>
        <Routes>
          {/* default: redirect root to /login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<OTPVerify />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* App pages */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/employee" element={<EmployeeDashboard />} />
          <Route path="/shoutouts" element={<Shoutouts />} />

          {/* fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
