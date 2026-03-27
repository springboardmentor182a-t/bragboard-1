import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import PageContainer from "./PageContainer";

export default function AdminLayout({ children }) {
  return (
    <div className="flex w-full h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main section */}
      <div className="flex flex-col flex-1">
        {/* Top navbar */}
        <Navbar />

        {/* Page content */}
        <PageContainer>
          {children}
        </PageContainer>
      </div>
    </div>
  );
}
