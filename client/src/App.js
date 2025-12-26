// src/App.js
import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { AuthProvider } from "./lib/authContext";
import BrandBadge from "./components/Common/BrandBadge";

// 👇 If your file is named LoginPage.jsx, change this import accordingly
import Login from "./components/Auth/Login"; // or "./pages/LoginPage"
import Register from "./components/Auth/Register";
import OTPVerify from "./components/Auth/OTPVerify";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";

import AdminDashboard from "./pages/AdminDashboard";
import ExportReports from "./pages/ExportReports";  
import EmployeeDashboard from "./pages/EmpDashboard";
import EmployeeReportingShoutout from "./pages/EmployeeReportingShoutout";
import Shoutouts from "./components/employee/Shoutouts";
import ApprovalRequests from "./components/Admin/ApprovalRequests";
import ApprovalStatus from "./pages/ApprovalStatus";


import "./index.css";

function AppShell() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  
  const handleLogin = ({ username, role }) => {
    
    setUser({ username, role });

    
    if (role === "admin") {
      navigate("/admin", { replace: true });
    } else {
      
      navigate("/employee", { replace: true });
    }
  };

  
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/reset-password" ||
    location.pathname === "/verify-otp";

  return (
    <>
      {isAuthPage && <BrandBadge />}

      <Routes>
        {/* default: redirect root to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth Routes */}
        <Route
          path="/login"
          element={<Login onLogin={handleLogin} />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<OTPVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* App pages */}
        <Route path="/admin" element={<AdminDashboard />} />
          <Route
          path="/admin/export-reports"
          element={<DashboardLayout><ExportReports /></DashboardLayout>}
        />
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/employee/reporting-shoutout" element={<EmployeeReportingShoutout />} />
        <Route path="/shoutouts" element={<Shoutouts />} />
        <Route path="/admin/approvals" element={<ApprovalRequests />} />
        <Route path="/ApprovalStatus" element={<ApprovalStatus />} />


        {/* fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
