import { DEPARTMENTS } from "../../data/constants";

function Departments() {
  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <div className="font-bold mb-2">Departments</div>
      <ul>
        {DEPARTMENTS.map((dept, idx) => (
          <li key={idx}>{dept}</li>
        ))}
      </ul>
    </div>
  );
}

export default Departments;
