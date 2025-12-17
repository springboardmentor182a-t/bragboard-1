import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function AdminReports() {
  const reports = [
    { id: 101, reportedBy: "Alice", reason: "Spam", status: "Pending" },
    { id: 102, reportedBy: "Robert", reason: "Duplicate", status: "Deleted" },
    { id: 103, reportedBy: "Sarah", reason: "Spam", status: "Resolved" }
  ];

  const statusClass = {
    Pending: "bg-amber-200 text-amber-900",
    Deleted: "bg-gray-200 text-gray-900",
    Resolved: "bg-green-200 text-green-900"
  };

  const navBtn = "w-full text-left py-2 px-4 rounded-xl hover:opacity-95";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-purple-800 text-white p-6 flex flex-col justify-between rounded-r-3xl shadow-lg">
        <div>
          <h1 className="text-2xl font-bold mb-8">BRAG BOARD</h1>

          <nav className="space-y-4">
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `${navBtn} ${isActive ? "bg-white text-black" : "bg-white/20"}`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/admin/shoutouts"
              className={({ isActive }) =>
                `${navBtn} ${isActive ? "bg-white text-black" : "bg-white/20"}`
              }
            >
              Shout-Outs
            </NavLink>

            <NavLink
              to="/admin/reports"
              className={({ isActive }) =>
                `${navBtn} ${isActive ? "bg-white text-black" : "bg-white/20"}`
              }
            >
              Reports
            </NavLink>

            <NavLink
              to="/admin/settings"
              className={({ isActive }) =>
                `${navBtn} ${isActive ? "bg-white text-black" : "bg-white/20"}`
              }
            >
              Settings
            </NavLink>
          </nav>
        </div>

        {/* Admin Icon */}
        <div className="flex items-center space-x-3 text-white">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2202/2202112.png"
            alt="admin"
            className="w-8 h-8 rounded-full bg-white/20 p-1"
          />
          <span className="font-medium">Admin</span>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10">
        <h2 className="text-3xl font-bold mb-8">REPORTING SHOUT-OUTS</h2>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-purple-400 p-6 rounded-2xl text-center text-white shadow">
            <h3 className="text-xl font-semibold">Total Reports</h3>
            <p className="mt-3 text-3xl font-bold">18</p>
          </div>

          <div className="bg-teal-300 p-6 rounded-2xl text-center text-black shadow">
            <h3 className="text-xl font-semibold">Pending Reports</h3>
            <p className="mt-3 text-3xl font-bold">5</p>
          </div>

          <div className="bg-green-400 p-6 rounded-2xl text-center text-white shadow">
            <h3 className="text-xl font-semibold">Resolved Reports</h3>
            <p className="mt-3 text-3xl font-bold">13</p>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-bold mb-4">Reported Shout-Outs</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-yellow-300">
                  <th className="p-3">Report ID</th>
                  <th className="p-3">Reported By</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {reports.map((r) => (
                  <tr key={r.id} className="border-b last:border-b-0">
                    <td className="p-3 align-middle">{r.id}</td>
                    <td className="p-3 align-middle">{r.reportedBy}</td>
                    <td className="p-3 align-middle">{r.reason}</td>

                    <td className="p-3 align-middle">
                      <span
                        className={`inline-block px-4 py-1 rounded-xl text-sm font-medium ${statusClass[r.status]}`}
                      >
                        {r.status}
                      </span>
                    </td>

                    <td className="p-3 align-middle">
                      <button className="bg-purple-300 px-4 py-1 rounded-xl hover:opacity-90">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}