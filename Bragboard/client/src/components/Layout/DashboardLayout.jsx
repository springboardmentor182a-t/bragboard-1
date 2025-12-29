import React, { useState } from "react";
import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden transition-colors duration-200">

      {/* Premium Background Blobs */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] bg-blue-200/40 dark:bg-blue-900/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[600px] h-[600px] bg-purple-200/40 dark:bg-purple-900/20 rounded-full blur-[128px] pointer-events-none" />

      {/* Main Layout Content */}
      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Content Area */}
        <div className={`flex-1 flex flex-col md:pl-64 ${sidebarOpen ? '' : ''}`}>
          {/* Navbar */}
          <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          {/* Main Content */}
          <main className="flex-1 px-6 pb-6 pt-0 transition-colors duration-200">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
