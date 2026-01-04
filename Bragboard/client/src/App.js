import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './Context/AuthContext';

// Pages
import LoginPage from './pages/auth/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import ShoutOuts from './pages/ShoutOuts';
import Reports from './pages/Reports';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import ExportReport from './pages/ExportReport';
import UserManagement from './pages/admin/UserManagement';
import Register from './features/authentication/pages/Register';

// Styles
import './App.css';

/* ---------------- Protected Route ---------------- */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

/* ---------------- App Routes ---------------- */
const AppContent = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          isAuthenticated()
            ? <Navigate to={isAdmin() ? "/admin/dashboard" : "/dashboard"} replace />
            : <LoginPage />
        }
      />

      <Route
        path="/signup"
        element={
          isAuthenticated()
            ? <Navigate to={isAdmin() ? "/admin/dashboard" : "/dashboard"} replace />
            : <Register />
        }
      />

      {/* Employee Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/shoutouts"
        element={
          <ProtectedRoute>
            <ShoutOuts />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/export-report"
        element={
          <ProtectedRoute adminOnly>
            <ExportReport />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute adminOnly>
            <UserManagement />
          </ProtectedRoute>
        }
      />

      {/* Default & 404 */}
      <Route
        path="/"
        element={
          isAuthenticated()
            ? <Navigate to={isAdmin() ? "/admin/dashboard" : "/dashboard"} replace />
            : <Navigate to="/login" state={{ from: location }} replace />
        }
      />

      <Route
        path="*"
        element={
          isAuthenticated()
            ? <Navigate to={isAdmin() ? "/admin/dashboard" : "/dashboard"} replace />
            : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
};

/* ---------------- Main App ---------------- */
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
