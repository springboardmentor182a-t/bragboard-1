import EmpSidebar from "./EmpSidebar";
import EmpHeader from "./EmpHeader";

function EmployeeDashboardLayout({ children, activeSection, setActiveSection }) {
  return (
    <div className="text-black">
    <div className="flex min-h-screen">

      <EmpSidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
      />

      <div className="flex-1 bg-gray-50 ml-[220px]">

        {/* FIXED HEADER */}
        <EmpHeader />

        {/* ADD MARGIN-TOP SO CONTENT DOESN'T GO UNDER HEADER */}
        <main className="p-8 mt-[74px]">
          {children}
        </main>
      </div>
    </div>
    </div>
  );
}

export default EmployeeDashboardLayout;
