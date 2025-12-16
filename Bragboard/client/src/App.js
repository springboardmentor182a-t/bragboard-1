import React, { useState } from "react";
import { AuthProvider } from "./Context/AuthContext";
import DashboardLayout from "./components/Layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import ShoutOuts from "./pages/ShoutOuts";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";
import ExportReport from "./pages/ExportReport";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "shoutouts":
        return <ShoutOuts />;
      case "reports":
        return <Reports />;
      case 'export':               
        return <ExportReport />;
      case "analytics": // ← ADD THIS
        return <Analytics />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AuthProvider>
      <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderContent()}
      </DashboardLayout>
    </AuthProvider>
  );
}

export default App;
