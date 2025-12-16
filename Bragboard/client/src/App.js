import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminReports from "./pages/AdminReports";
import Dashboard from "./pages/Dashboard";
import Shoutouts from "./pages/Shoutouts";
import Settings from "./pages/Settings";
import Reports from "./pages/Admin/Reports";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/reports" replace />} />

        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/shoutouts" element={<Shoutouts />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/reports/details" element={<Reports />} />

        {/* fallback */}
        <Route path="*" element={<div className="p-8">Page not found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
