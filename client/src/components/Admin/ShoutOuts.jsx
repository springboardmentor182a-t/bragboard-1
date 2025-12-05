// src/pages/ShoutoutsPage.jsx
import { SHOUTOUTS, getEmployeeName } from "../../data/constants";

function ShoutoutsPage() {
  const shoutouts = [...SHOUTOUTS].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header + filters */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Shout-outs</h1>
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search by name or tag..."
            className="w-56 rounded-lg border border-slate-300 px-3 py-1 text-sm"
          />
          <select className="rounded-lg border border-slate-300 px-3 py-1 text-sm">
            <option value="">All Tags</option>
            <option value="Teamwork">#Teamwork</option>
            <option value="Innovation">#Innovation</option>
            <option value="Leadership">#Leadership</option>
            <option value="Support">#Support</option>
            <option value="CustomerFirst">#CustomerFirst</option>
          </select>
        </div>
      </header>

      {/* Shoutouts table */}
      <section className="rounded-xl bg-white shadow-sm p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-2 text-left font-medium">From</th>
                <th className="px-4 py-2 text-left font-medium">To</th>
                <th className="px-4 py-2 text-left font-medium">Reason</th>
                <th className="px-4 py-2 text-left font-medium">Tag</th>
                <th className="px-4 py-2 text-left font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shoutouts.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-[11px] font-medium text-slate-700">
                        {getEmployeeName(s.from)
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                      <span className="text-slate-800 text-sm">
                        {getEmployeeName(s.from)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-slate-800">
                    {getEmployeeName(s.to)}
                  </td>
                  <td className="px-4 py-2 text-slate-500">
                    {s.reason}
                  </td>
                  <td className="px-4 py-2">
                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700">
                      #{s.tag}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-[12px] text-slate-400">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}

              {shoutouts.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-sm text-slate-400"
                  >
                    No shout-outs yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default ShoutoutsPage;
