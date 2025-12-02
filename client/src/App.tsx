import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import OtpVerificationPage from './pages/auth/OtpVerificationPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import RegisterPage from './pages/auth/RegisterPage';
import { Dashboard } from './pages/dashboard/Dashboard';

export type UserRole = 'admin' | 'employee';

export interface UserData {
  name: string;
  email: string;
}

function App() {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleLogin = (role: UserRole, data: UserData) => {
    setUserRole(role);
    setUserData(data);
  };

  const handleLogout = () => {
    setUserRole(null);
    setUserData(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Root route: if logged in, go to Dashboard; otherwise redirect to login */}
        <Route
          path="/"
          element={
            userRole && userData ? (
              <Dashboard userRole={userRole} userData={userData} onLogout={handleLogout} />
            ) : (
              <Navigate to="/auth/login" replace />
            )
          }
        />

        {/* Authentication routes */}
        <Route path="/auth/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/otp" element={<OtpVerificationPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
