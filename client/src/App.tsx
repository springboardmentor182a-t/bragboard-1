// src/App.tsx
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/auth/LoginPage.tsx';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.tsx';
import OtpVerificationPage from './pages/auth/OtpVerificationPage.tsx';
import ResetPasswordPage from './pages/auth/ResetPasswordPage.tsx';
import RegisterPage from './pages/auth/RegisterPage.js';
import { Dashboard } from './pages/dashboard/Dasboard.tsx';

type UserRole = 'admin' | 'employee';

interface UserData {
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
      <div className="min-h-screen">
        <Routes>
          <Route
            path="/"
            element={userRole && userData ? (
              <Dashboard userRole={userRole} userData={userData} onLogout={handleLogout} />
            ) : (
              <Navigate to="/auth/login" replace />
            )}
          />

          <Route path="/auth/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/otp" element={<OtpVerificationPage />} />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
