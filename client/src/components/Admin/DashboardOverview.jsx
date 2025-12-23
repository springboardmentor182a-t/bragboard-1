import { Link } from "react-router-dom";
import {
  DEPARTMENTS,
  EMPLOYEES,
  SHOUTOUTS,
  getEmployeeName,
  LEADERBOARD,
} from "../../data/constants";
import ShoutoutsPage from "../Common/ShoutOuts";
function DashboardOverview() {
  const recent = [...SHOUTOUTS]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <><div className="space-y-6">
      {/* Top stats */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-green-100 p-6 rounded shadow flex items-center gap-4">
            <span className="text-xl font-semibold">
              Departments: {DEPARTMENTS.length}
            </span>
          </div>
          <div className="bg-blue-100 p-6 rounded shadow flex items-center gap-4">
            <span className="text-xl font-semibold">
              Employees: {EMPLOYEES.length}
            </span>
          </div>
          <div className="bg-yellow-100 p-6 rounded shadow flex items-center gap-4">
            <span className="text-xl font-semibold">
              ShoutOuts: {SHOUTOUTS.length}
            </span>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700">
            Add Department
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
            Add Employee
          </button>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600">
            New ShoutOut
          </button>
        </div>
      </div>

      {/* Recent shout-outs preview */}
     {/* Recent shout-outs preview */}
<section className="rounded-2xl bg-gradient-to-br from-indigo-50 via-slate-50 to-white shadow-sm p-4">
  <div className="flex items-center justify-between mb-3">
    <div>
      <h2 className="text-sm font-semibold text-slate-900">
        Recent shout-outs
      </h2>
      <p className="text-[11px] text-slate-500">
        Quick glance at the latest recognition activity.
      </p>
    </div>
  </div>

  <div className="space-y-3">
    {recent.map((s) => {
      const toName = getEmployeeName(s.to);
      const initials = toName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

      return (
        
          <div className="flex items-center gap-3">
            {/* Avatar + emoji */}
            <div className="relative shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-semibold">
                {initials}
              </div>
              <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-white flex items-center justify-center text-[11px] shadow">
                {s.emoji}
              </span>
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-900 truncate">
                <span className="font-semibold">
                  {getEmployeeName(s.from)}
                </span>
                <span className="text-slate-400"> gave a shout-out to </span>
                <span className="font-semibold">{toName}</span>
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500 line-clamp-1">
                {s.reason}
              </p>
              <div className="mt-1 flex items-center gap-2 text-[10px]">
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 font-medium text-indigo-700">
                  #{s.tag}
                </span>
                <span className="text-slate-400">
                  {new Date(s.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
      );
    })}

    {recent.length === 0 && (
      <p className="text-xs text-slate-400">
        No shout-outs yet. They will appear here once created.
      </p>
    )}
  </div>
</section>

    </div>
      </>

  );
}

export default DashboardOverview;

