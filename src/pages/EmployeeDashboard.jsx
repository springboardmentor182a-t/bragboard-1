import Placeholder from "../components/Placeholder";
import PerformanceCharts from "../components/PerformanceCharts";

export default function EmployeeDashboard() {
  return (
    <div className="grid grid-cols-1 gap-6">

      <Placeholder title="My Tasks" />

      <Placeholder title="Announcements" />

      {/* Animated Charts */}
      <PerformanceCharts />

    </div>
  );
}
