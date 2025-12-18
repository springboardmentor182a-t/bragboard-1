import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navbar Placeholder */}
      <Navbar />

      {/* Left Sidebar Placeholder */}
      <Sidebar />

      {/* Main Content Placeholder */}
      <main className="ml-64 pt-16 px-6">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
