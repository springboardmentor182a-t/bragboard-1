// src/App.js
import React, { useState, useEffect } from "react";
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
import Shoutouts from "./components/employee/Shoutouts";
import ApprovalRequests from "./components/Admin/ApprovalRequests";
import ApprovalStatus from "./pages/ApprovalStatus";

import "./index.css";

// ========== THEME CONTEXT ==========
const ThemeContext = React.createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    }
  }, []);

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
    
    // Add theme class to body for easy CSS targeting
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
// ========== END THEME CONTEXT ==========

// Simple Theme Toggle Component
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
        padding: '10px 15px',
        borderRadius: '50px',
        border: 'none',
        background: theme === 'light' ? '#1a1a1a' : '#f0f0f0',
        color: theme === 'light' ? '#ffffff' : '#000000',
        cursor: 'pointer',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
      <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
    </button>
  );
};

// Update index.css for theme support
// Add this to your existing index.css file:
/*
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --text-primary: #212529;
  --text-secondary: #6c757d;
  --border-color: #dee2e6;
  --card-bg: #ffffff;
  --shadow: 0 2px 4px rgba(0,0,0,0.1);
}

[data-theme="dark"] {
  --bg-primary: #121212;
  --bg-secondary: #1e1e1e;
  --text-primary: #f8f9fa;
  --text-secondary: #adb5bd;
  --border-color: #495057;
  --card-bg: #2d2d2d;
  --shadow: 0 2px 4px rgba(0,0,0,0.3);
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow);
}

input, select, textarea {
  background: var(--card-bg);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}
*/

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
          element={<ExportReports />}
        />
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/shoutouts" element={<Shoutouts />} />
        <Route path="/admin/approvals" element={<ApprovalRequests />} />
        <Route path="/ApprovalStatus" element={<ApprovalStatus />} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      {/* Add Theme Toggle button on all pages except auth pages */}
      {!isAuthPage && <ThemeToggle />}
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
