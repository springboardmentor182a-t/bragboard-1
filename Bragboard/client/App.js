import React, { useState } from "react";
import { AuthProvider } from "./Context/AuthContext";
import DashboardLayout from "./components/Layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import ShoutOuts from "./pages/ShoutOuts";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Admin/Reports";
import ExportReport from "./pages/ExportReport";

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'shoutouts':
        return <ShoutOuts />;
      case 'analytics':
        return <Analytics />;
      case 'reports':
        return <Reports />;
      case 'export':
        return <ExportReport />;
      case 'settings':
        return <Settings />;
      case 'AdminReports':
        return <Settings />;
      default:
        return <Route path="/admin/reports" element={<AdminReports />} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
          {renderContent()}
        </DashboardLayout>
      </div>
    </AuthProvider>
  );
};

export default App;
