import React from "react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100"> 
      <main className="ml-64 pt-16 px-6">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
