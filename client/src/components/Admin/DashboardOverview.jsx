import { DEPARTMENTS, EMPLOYEES, SHOUTOUTS } from "../../data/constants";
function DashboardOverview() {
  return (
    <div>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-green-100 p-6 rounded shadow flex items-center gap-4">
          <span className="text-xl font-semibold">Departments: {DEPARTMENTS.length}</span>
        </div>
        <div className="bg-blue-100 p-6 rounded shadow flex items-center gap-4">
          <span className="text-xl font-semibold">Employees: {EMPLOYEES.length}</span>
        </div>
        <div className="bg-yellow-100 p-6 rounded shadow flex items-center gap-4">
          <span className="text-xl font-semibold">ShoutOuts: {SHOUTOUTS.length}</span>
        </div>
      </div>
      <div className="flex gap-4">
        <button className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700">Add Department</button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">Add Employee</button>
        <button className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600">New ShoutOut</button>
      </div>
    </div>
  );
}
export default DashboardOverview;
