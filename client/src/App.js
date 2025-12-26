// src/App.js
import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider } from "./lib/authContext";
import BrandBadge from "./components/Common/BrandBadge";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import OTPVerify from "./components/Auth/OTPVerify";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmpDashboard";
import Shoutouts from "./components/employee/Shoutouts";
import EmployeeReportingShoutout from "./pages/EmployeeReportingShoutout";
import ApprovalStatus from "./pages/ApprovalStatus";

import "./index.css";
function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogin = ({ username, role }) => {
    console.log("Logged in user:", { username, role });
    if (role === "admin") {
      navigate("/admin", { replace: true });
    } else {
      navigate("/employee", { replace: true });
    }
  };
  const isAuthPage = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-otp",
  ].includes(location.pathname);
  return (
    <>
      {isAuthPage && <BrandBadge />}
      <Routes>
        {/* Default */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* Auth Routes */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<OTPVerify />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* Dashboards */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/employee" element={<EmployeeDashboard />} />

        {/* Other Pages */}
        <Route path="/shoutouts" element={<Shoutouts />} />
        <Route path="/employee/reporting-shoutout" element={<EmployeeReportingShoutout />} />

        <Route path="/ApprovalStatus" element={<ApprovalStatus />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}
function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
export default App;
