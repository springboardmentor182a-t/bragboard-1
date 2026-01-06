import { useState, useEffect } from "react";
import { DEPARTMENTS as INIT_DEPTS, EMPLOYEES as INIT_EMPS } from "../../data/constants";

function Departments() {
  const STORAGE_KEY = "departments";

  // Initialize departments
  const [departments, setDepartments] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.filter((d) => d?.name && String(d.name).trim() !== "");
        }
      }
    } catch {}
    return INIT_DEPTS
      .map((d, idx) =>
        typeof d === "string"
          ? { id: `dept-${idx + 1}`, name: d, numEmployees: 0 }
          : { id: d.id ?? `dept-${idx + 1}`, name: d.name ?? "", numEmployees: d.numEmployees ?? 0 }
      )
      .filter((d) => d.name && String(d.name).trim() !== "");
  });

  // Initialize employees
  const [employees, setEmployees] = useState(() => {
    try {
      const raw = localStorage.getItem("employees");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.filter((e) => e?.name && String(e.name).trim() !== "");
      }
    } catch {}
    return INIT_EMPS.filter((e) => e.name && String(e.name).trim() !== "");
  });

  // Persist departments
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(departments));
    } catch {}
  }, [departments]);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [numEmployees, setNumEmployees] = useState("");
  const [editingId, setEditingId] = useState(null);

  const handleAddDepartment = (e) => {
    e.preventDefault();
    if (!name || !id || !numEmployees) return;

    const newDept = { name, id, numEmployees: parseInt(numEmployees) };
    if (editingId) {
      setDepartments(departments.map((d) => (d.id === editingId ? newDept : d)));
      setEditingId(null);
    } else {
      setDepartments([...departments, newDept]);
    }
    setName(""); setId(""); setNumEmployees(""); setShowForm(false);
  };

  const handleDelete = (deptId) => {
    if (window.confirm("Delete this department?")) {
      setDepartments(departments.filter((d) => d.id !== deptId));
    }
  };

  const startEdit = (dept) => {
    setShowForm(true);
    setEditingId(dept.id);
    setName(dept.name || "");
    setId(String(dept.id ?? ""));
    setNumEmployees(String(dept.numEmployees ?? ""));
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Header with button */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="font-semibold text-gray-800 text-lg">Departments</h1>
        <button
          onClick={() => {
            if (showForm) setEditingId(null);
            setShowForm(!showForm);
          }}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
        >
          {showForm ? "✖ Close" : "➕ Add Department"}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <form
          onSubmit={handleAddDepartment}
          className="bg-white p-2 rounded shadow border border-gray-100 mb-2 space-y-1"
        >
          <input
            type="text"
            placeholder="Department Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-2 py-1 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Department ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-full border px-2 py-1 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          <input
            type="number"
            placeholder="Number of Employees"
            value={numEmployees}
            onChange={(e) => setNumEmployees(e.target.value)}
            className="w-full border px-2 py-1 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
          >
            {editingId ? "Save" : "Add"}
          </button>
        </form>
      )}

      {/* Departments List */}
      <div className="space-y-1">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="flex justify-between items-center p-2 bg-white rounded shadow border border-gray-100"
          >
            <div>
              <div className="font-medium">{dept.name}</div>
              <div className="text-gray-500 text-xs">
                ID: {dept.id} | Employees: {employees.filter((e) => (e.department || "").trim().toLowerCase() === (dept.name || "").trim().toLowerCase()).length}
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => startEdit(dept)}
                className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded hover:bg-amber-200 text-xs"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(dept.id)}
                className="bg-red-100 text-red-600 px-2 py-0.5 rounded hover:bg-red-200 text-xs"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {departments.length === 0 && (
          <p className="text-gray-400 text-xs text-center mt-2">No departments yet.</p>
        )}
      </div>
    </div>
  );
}

export default Departments;
