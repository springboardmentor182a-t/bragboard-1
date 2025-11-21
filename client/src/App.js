import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Admin Layout
import Navbar from "./layout/Navbar";
import PageContainer from "./layout/PageContainer";

// Admin Pages
import AdminReportsPage from "./pages/reports/AdminReportsPage";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import OtpVerificationPage from "./pages/auth/OtpVerificationPage";


function App() {
  return (
    <Router>
      <Routes>
        {/* ------------------ AUTH PAGES ------------------ */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<OtpVerificationPage />} />

        {/* ------------------ ADMIN PAGES ------------------ */}
        <Route
          path="/reports"
          element={
            <PageContainer>
              <Navbar />
              <AdminReportsPage />
            </PageContainer>
          }
        />

        {/* ------------------ 404 PAGE ------------------ */}
        <Route path="*" element={<h2>Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
