import React, { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import DashboardLayout from "./components/Layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Shoutouts from "./pages/Shoutouts";
import Reports from "./pages/Admin/Reports";
import Settings from "./pages/Settings";

const App = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "shoutouts":
        return <Shoutouts />;
      case "analytics":
        return <Reports />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
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
