// client/src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "./AuthContext";

import LoginPage from "./pages/auth/LoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import OTPVerificationPage from "./pages/auth/OtpVerificationPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";   // <-- ADD THIS
import AdminReportsPage from "./pages/reports/AdminReportsPage";
import ReportShoutoutPage from "./pages/reports/ReportShoutoutPage";

const RequireAuth: React.FC<{ role: "admin" | "employee"; children: React.ReactNode }> = ({ role, children }) => {
  const { isAuthenticated, userRole } = useAuth();
  if (!isAuthenticated) return <Navigate to="/auth/login" />;
  if (userRole !== role) return <Navigate to="/" />;
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" richColors />

        <Routes>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/verify-otp" element={<OTPVerificationPage />} />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />  {/* <-- REQUIRED */}

          {/* Employee */}
          <Route
            path="/report-shoutout"
            element={
              <RequireAuth role="employee">
                <ReportShoutoutPage />
              </RequireAuth>
            }
          />

          {/* Admin */}
          <Route
            path="/admin/reports"
            element={
              <RequireAuth role="admin">
                <AdminReportsPage />
              </RequireAuth>
            }
          />

          <Route path="*" element={<Navigate to="/auth/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
