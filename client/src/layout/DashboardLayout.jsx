<<<<<<< HEAD
import Sidebar from "./Sidebar";
import Header from "./Header";

function DashboardLayout({ children, activeSection, setActiveSection }) {
  return (
    <div className="text-black">
      {/* Wrapper */}
      <div className="flex">
        
        {/* Sidebar (forced fixed via wrapper) */}
        <div className="fixed top-0 left-0 h-screen w-64 z-50">
          <Sidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
        </div>

        {/* Main content area */}
        <div className="ml-64 flex-1 min-h-screen bg-gray-50">
          
          {/* Fixed Header */}
          <div className="fixed top-0 left-64 right-0 h-16 z-40 bg-white shadow">
            <Header />
          </div>

          {/* Page Content */}
          <main className="pt-20 p-8">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
=======
import Sidebar from "./Sidebar";
import Header from "./Header";

function DashboardLayout({ children, activeSection, setActiveSection }) {
  return (
    <div className="text-black">
      {/* Wrapper */}
      <div className="flex">
        
        {/* Sidebar (forced fixed via wrapper) */}
        <div className="fixed top-0 left-0 h-screen w-64 z-50">
          <Sidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
        </div>

        {/* Main content area */}
        <div className="ml-64 flex-1 min-h-screen bg-gray-50">
          
          {/* Fixed Header */}
          <div className="fixed top-0 left-64 right-0 h-16 z-40 bg-white shadow">
            <Header />
          </div>

          {/* Page Content */}
          <main className="pt-20 p-8">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
>>>>>>> 3e2424c214281832d92a15cbeb86496329d2c772
