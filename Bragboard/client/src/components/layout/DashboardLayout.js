import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main content - increased margin to match wider sidebar */}
      <main className="ml-64 pt-12"> {/* Increased from ml-48 to ml-64 */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;