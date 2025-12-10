import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main content with proper spacing */}
      <main className="ml-64 pt-12">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;