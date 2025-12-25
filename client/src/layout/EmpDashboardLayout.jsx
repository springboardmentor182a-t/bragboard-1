<<<<<<< HEAD
// EmpDashboardLayout.jsx
import EmpSidebar from "./EmpSiderbar";
import Navbar from "./Navbar";

function EmployeeDashboardLayout({
  activeSection,
  setActiveSection,
  onLogout,
  children,
}) {
  return (
    <div className="h-screen flex bg-gray-50">
      {/* LEFT SIDEBAR */}
      <EmpSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col ml-[256px]">
        {/* TOP NAVBAR */}
         <Navbar setActiveSection={setActiveSection} onLogout={onLogout} />
       

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 mt-[70px] overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default EmployeeDashboardLayout;
=======
// EmpDashboardLayout.jsx
import EmpSidebar from "./EmpSiderbar";
import Navbar from "./Navbar";

function EmployeeDashboardLayout({
  activeSection,
  setActiveSection,
  onLogout,
  children,
}) {
  return (
    <div className="h-screen flex bg-gray-50">
      {/* LEFT SIDEBAR */}
      <EmpSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col ml-[256px]">
        {/* TOP NAVBAR */}
         <Navbar setActiveSection={setActiveSection} onLogout={onLogout} />
       

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 mt-[70px] overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default EmployeeDashboardLayout;
>>>>>>> 3e2424c214281832d92a15cbeb86496329d2c772
