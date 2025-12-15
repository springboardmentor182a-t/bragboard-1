// EmpDashboardLayout.jsx
import EmpSidebar from "./EmpSiderbar";
import Navbar from "./Navbar";
import EmpSidebar from "./EmpSidebar";
import Navbar from "./Navbar";

function EmployeeDashboardLayout({
  activeSection,
  setActiveSection,
  onLogout,
  children,
}) {
  return (
    <div className="h-screen flex text-black">
      {/* LEFT SIDEBAR */}
      <EmpSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col">
        {/* TOP NAVBAR */}
         <Navbar setActiveSection={setActiveSection} onLogout={onLogout} />
       

        {/* MAIN CONTENT */}
        <main className="mt-[70px] ml-[220px] p-6 main-bg">
          {children}
        </main>
      </div>
    </div>
  );
}

export default EmployeeDashboardLayout;
