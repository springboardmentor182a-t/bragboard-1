import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import DashboardLayout from './components/Layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import ShoutOuts from './pages/ShoutOuts';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'shoutouts':
        return <ShoutOuts />;
      case 'analytics':  // Changed from 'reports' to 'analytics'
        return <Reports />;
      case 'settings':
        return <Settings />;
      case 'export':               
        return <ExportReport />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AuthProvider>
      {/* Add a fixed container for the entire app */}
      <div className="min-h-screen bg-gray-50">
        <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
          <div className="pt-4">
            {renderContent()}
          </div>
        </DashboardLayout>
      </div>
    </AuthProvider>
  );
};

export default App;