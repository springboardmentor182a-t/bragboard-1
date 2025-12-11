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

      {/* Shoutouts as cards */}
      <section className="rounded-xl bg-white shadow-sm p-4">
        <div className="space-y-3">
          {shoutouts.map((s) => {
            const fromName = getEmployeeName(s.from);
            const toName = getEmployeeName(s.to);
            const initials = toName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <article
                key={s.id}
                className="flex gap-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 hover:border-indigo-200 hover:bg-indigo-50/40 transition"
              >
                {/* Avatar */}
                <div className="flex flex-col items-center gap-1">
                  <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white text-sm font-semibold shadow-sm">
                      {initials}
                    </div>
                    <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-white flex items-center justify-center text-xs shadow">
                      {s.emoji}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900">
                    <span className="font-semibold">{fromName}</span>
                    <span className="text-slate-400"> gave a shout-out to </span>
                    <span className="font-semibold">{toName}</span>
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Reason: {s.reason}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px]">
                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 font-medium text-indigo-700">
                      #{s.tag}
                    </span>
                    <span className="text-slate-400">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}

          {shoutouts.length === 0 && (
            <p className="px-2 py-6 text-center text-sm text-slate-400">
              No shout-outs yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default ShoutoutsPage;
