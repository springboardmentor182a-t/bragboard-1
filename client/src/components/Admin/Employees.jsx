import { EMPLOYEES } from "../../data/constants";

function Employees() {
  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <div className="font-bold mb-2">Employees</div>
      <ul>
        {EMPLOYEES.map(emp => (
          <li key={emp.id}>
            {emp.name} <span className="text-gray-500 text-sm">({emp.department})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Employees;
