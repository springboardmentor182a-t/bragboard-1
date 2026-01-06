import { useEffect, useState } from "react";
import { EMPLOYEES as INIT_EMPS } from "../../data/constants";

function Employees() {
  const STORAGE_KEY = "employees";

  // Initialize from localStorage; if empty, seed from constants
  const [employees, setEmployees] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.filter((e) => e?.name && String(e.name).trim() !== "");
        }
      }
    } catch {}
    return INIT_EMPS.map((e) => ({
      id: e.id,
      name: e.name,
      department: e.department || "General",
    })).filter((e) => e.name && String(e.name).trim() !== "");
  });

  // Persist to localStorage whenever employees change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
    } catch {}
  }, [employees]);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [department, setDepartment] = useState("");
  const [editingOriginalId, setEditingOriginalId] = useState(null);

  const handleAddOrSave = (e) => {
    e.preventDefault();
    if (!name || !id || !department) return;

    const newEmp = { id, name, department };
    if (editingOriginalId) {
      setEmployees(employees.map((e) => (e.id === editingOriginalId ? newEmp : e)));
      setEditingOriginalId(null);
    } else {
      setEmployees([...employees, newEmp]);
    }
    setName("");
    setId("");
    setDepartment("");
    setShowForm(false);
  };

  const handleDelete = (empId) => {
    if (window.confirm("Delete this employee?")) {
      setEmployees(employees.filter((e) => e.id !== empId));
    }
  };

  const startEdit = (emp) => {
    setShowForm(true);
    setEditingOriginalId(emp.id);
    setName(emp.name || "");
    setId(String(emp.id ?? ""));
    setDepartment(emp.department || "");
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4 text-sm">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-gray-800 text-lg">Employees</h1>
        <button
          onClick={() => {
            if (showForm) {
              setEditingOriginalId(null);
              setName("");
              setId("");
              setDepartment("");
            }
            setShowForm(!showForm);
          }}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
        >
          {showForm ? "✖ Close" : "➕ Add Employee"}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <form onSubmit={handleAddOrSave} className="bg-white p-3 rounded shadow border border-gray-100 space-y-2">
          <input
            type="text"
            placeholder="Employee Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-2 py-1 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Employee ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-full border px-2 py-1 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full border px-2 py-1 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm">
            {editingOriginalId ? "Save" : "Add"}
          </button>
        </form>
      )}

      {/* Employees List */}
      <div className="space-y-2">
        {employees.map((emp, idx) => (
          <div key={idx} className="flex justify-between items-center p-2 bg-white rounded shadow border border-gray-100">
            <div>
              <div className="font-medium">{emp.name}</div>
              <div className="text-gray-500 text-xs">ID: {emp.id} | Department: {emp.department}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(emp)} className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded hover:bg-amber-200 text-xs">
                Edit
              </button>
              <button onClick={() => handleDelete(emp.id)} className="bg-red-100 text-red-600 px-2 py-0.5 rounded hover:bg-red-200 text-xs">
                Delete
              </button>
            </div>
          </div>
        ))}
        {employees.length === 0 && (
          <p className="text-gray-400 text-center mt-2 text-xs">No employees yet.</p>
        )}
      </div>
    </div>
  );
}

export default Employees;
