import Sidebar from './Sidebar';
import Header from './Header';

function DashboardLayout({ children, activeSection, setActiveSection }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex-1 bg-gray-50">
        <Header />                {/* <- Add Header here */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
export default DashboardLayout;
