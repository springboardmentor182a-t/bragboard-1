import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navbar */}
      <Navbar />

      {/* Left Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main
        className="
          ml-64               /* space for sidebar width (64 = 16rem = 256px) */
          pt-20              /* space for navbar height */
          px-8
          w-[calc(100%-16rem)]   /* auto-fit content beside sidebar */
        "
      >
        {/* Prevent overflow & keep charts responsive */}
        <div className="max-w-full">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
