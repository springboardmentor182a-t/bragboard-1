<<<<<<< HEAD
import { DEPARTMENTS } from "../../data/constants";

function Departments() {
  return (
    <div className="text-black">
    <div className="bg-white p-4 rounded shadow mb-6">
      <div className="font-bold mb-2">Departments</div>
      <ul>
        {DEPARTMENTS.map((dept, idx) => (
          <li key={idx}>{dept}</li>
        ))}
      </ul>
    </div>
    </div>
  );
}

export default Departments;
=======
import { DEPARTMENTS } from "../../data/constants";

function Departments() {
  return (
    <div className="text-black">
    <div className="bg-white p-4 rounded shadow mb-6">
      <div className="font-bold mb-2">Departments</div>
      <ul>
        {DEPARTMENTS.map((dept, idx) => (
          <li key={idx}>{dept}</li>
        ))}
      </ul>
    </div>
    </div>
  );
}

export default Departments;
>>>>>>> 3e2424c214281832d92a15cbeb86496329d2c772
