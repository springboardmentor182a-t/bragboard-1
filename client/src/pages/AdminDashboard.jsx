import { useState } from 'react';
import DashboardLayout from '../components/Admin/DashboardLayout';
import AnalyticsCards from '../components/Admin/AnalyticsCards';
import ShoutOuts from '../components/Admin/ShoutOuts';
import Departments from '../components/Admin/Departments';
import Employees from '../components/Admin/Employees';
import Leaderboard from '../components/Admin/Leaderboard';
import DashboardOverview from '../components/Admin/DashboardOverview';

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading] = useState(false);

  let SectionComponent;
  switch (activeSection) {
    case 'dashboard':
      SectionComponent = <DashboardOverview />;
      break;
    case 'analytics':
      SectionComponent = <AnalyticsCards loading={loading} />;
      break;
    case 'shoutouts':
      SectionComponent = <ShoutOuts />;
      break;
    case 'departments':
      SectionComponent = <Departments />;
      break;
    case 'employees':
      SectionComponent = <Employees />;
      break;
    case 'leaderboard':
      SectionComponent = <Leaderboard loading={loading} />;
      break;
    default:
      SectionComponent = <div>Select a section.</div>;
  }

  return (
    <DashboardLayout activeSection={activeSection} setActiveSection={setActiveSection}>
      {SectionComponent}
    </DashboardLayout>
  );
}
export default AdminDashboard;
