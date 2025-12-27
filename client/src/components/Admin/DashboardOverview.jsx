import { useState, useEffect } from "react";
import Departments from "./Departments";
import Employees from "./Employees";
import { EMPLOYEES as INIT_EMPS, SHOUTOUTS as INIT_SHOUTS, getEmployeeName } from "../../data/constants";

function DashboardOverview() {
  const [view, setView] = useState("overview"); // "overview" or "departments"
  const [employees, setEmployees] = useState([...INIT_EMPS]);
  const [shoutouts, setShoutouts] = useState([...INIT_SHOUTS]);
  const [departmentsCount, setDepartmentsCount] = useState(0);
  const [employeesCount, setEmployeesCount] = useState(0);

  const readDepartmentsCount = () => {
    try {
      const raw = localStorage.getItem("departments");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.filter((d) => d?.name && String(d.name).trim() !== "").length;
        }
      }
    } catch {}
    // Fallback to constants: map strings/objects to normalized names
    return (Array.isArray(INIT_EMPS) ? 0 : 0) ||
      (Array.isArray(INIT_SHOUTS) ? 0 : 0) ||
      (Array.isArray([]) ? 0 : 0);
  };

  useEffect(() => {
    setDepartmentsCount(readDepartmentsCount());
    setEmployeesCount(readEmployeesCount());
  }, []);

  useEffect(() => {
    if (view === "overview") {
      setDepartmentsCount(readDepartmentsCount());
      setEmployeesCount(readEmployeesCount());
    }
  }, [view]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "departments") {
        setDepartmentsCount(readDepartmentsCount());
      } else if (e.key === "employees") {
        setEmployeesCount(readEmployeesCount());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const readEmployeesCount = () => {
    try {
      const raw = localStorage.getItem("employees");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.filter((e) => e?.name && String(e.name).trim() !== "").length;
        }
      }
    } catch {}
    return INIT_EMPS.length;
  };

  const recent = [...shoutouts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const handleAddDepartmentClick = () => {
    setView("departments"); // Switch to departments page
  };

  const handleAddEmployeeClick = () => {
    setView("employees");
  };

  const handleAddShoutout = () => {
    const newShout = {
      id: Date.now(),
      from: employees[0]?.id || 1,
      to: employees[1]?.id || 2,
      reason: "Great teamwork!",
      tag: "teamwork",
      emoji: "👏",
      createdAt: new Date(),
    };
    setShoutouts([newShout, ...shoutouts]);
    alert(`ShoutOut added!`);
  };

  // Render Departments page if view === "departments"
  if (view === "departments") {
    return <Departments goBack={() => setView("overview")} />;
  }
  if (view === "employees") {
    return <Employees goBack={() => setView("overview")} />;
  }

  // Dashboard Overview view
  return (
    <div className="space-y-6">
      {/* Top stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        <div className="bg-green-100 p-4 rounded shadow flex items-center justify-center">
          <span className="text-xl font-semibold">Departments: {departmentsCount}</span>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow flex items-center justify-center">
          <span className="text-xl font-semibold">Employees: {employeesCount}</span>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow flex items-center justify-center">
          <span className="text-xl font-semibold">ShoutOuts: {shoutouts.length}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleAddDepartmentClick}
          className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
        >
          Add Department
        </button>
        <button
          onClick={handleAddEmployeeClick}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Add Employee
        </button>
        <button
          onClick={handleAddShoutout}
          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
        >
          New ShoutOut
        </button>
      </div>

      {/* Recent shout-outs */}
      <section className="rounded-2xl bg-gradient-to-br from-indigo-50 via-slate-50 to-white shadow-sm p-4 max-w-md">
        <h2 className="text-sm font-semibold text-slate-900 mb-2">Recent shout-outs</h2>
        {recent.map((s) => {
          const toName = getEmployeeName(s.to);
          const initials = toName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
          return (
            <div key={s.id} className="flex items-center gap-3 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-semibold">{initials}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-900 truncate">
                  <span className="font-semibold">{getEmployeeName(s.from)}</span>
                  <span className="text-slate-400"> gave a shout-out to </span>
                  <span className="font-semibold">{toName}</span>
                </p>
                <p className="text-[11px] text-slate-500 line-clamp-1">{s.reason}</p>
              </div>
            </div>
          );
        })}
        {recent.length === 0 && <p className="text-xs text-slate-400">No shout-outs yet.</p>}
      </section>
    </div>
  );
}

export default DashboardOverview;
