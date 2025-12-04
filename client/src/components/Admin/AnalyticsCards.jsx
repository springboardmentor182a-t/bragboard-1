import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  SHOUTOUTS,
  EMPLOYEES,
  DEPARTMENTS,
  computeTopTag,
} from "../../data/constants";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  ArcElement,
  Tooltip,
  Legend
);

function AnalyticsCards({ loading }) {
  // KPI values
  const totalShoutouts = SHOUTOUTS.length;
  const activeUsers = EMPLOYEES.length;
  const topTag = computeTopTag(SHOUTOUTS);

  // ---------- TOP EMPLOYEES ----------
  const employeeStats = EMPLOYEES.map((emp) => {
    const myShoutouts = SHOUTOUTS.filter(
      (s) => s.from === emp.id || s.to === emp.id
    );
    const sent = myShoutouts.filter((s) => s.from === emp.id).length;
    const received = myShoutouts.filter((s) => s.to === emp.id).length;
    const comments = myShoutouts.reduce(
      (sum, s) => sum + (s.commentsCount || 0),
      0
    );
    const reactions = myShoutouts.reduce(
      (sum, s) => sum + (s.reactionsCount || 0),
      0
    );
    const total = sent + received + comments + reactions;
    return { name: emp.name, sent, received, comments, reactions, total };
  })
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const topEmployees = employeeStats.map((e) => e.name);
  const sent = employeeStats.map((e) => e.sent);
  const received = employeeStats.map((e) => e.received);
  const commentsByEmp = employeeStats.map((e) => e.comments);
  const reactionsByEmp = employeeStats.map((e) => e.reactions);

  const barData = {
    labels: topEmployees,
    datasets: [
      { label: "Comments", data: commentsByEmp, backgroundColor: "#f97316" },
      { label: "Reactions", data: reactionsByEmp, backgroundColor: "#8b5cf6" },
      { label: "Received", data: received, backgroundColor: "#22c55e" },
      { label: "Sent", data: sent, backgroundColor: "#3b82f6" },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom", labels: { boxWidth: 12, boxHeight: 12 } },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
  };

  // ---------- WEEKLY ENGAGEMENT ----------
  const weeklyBuckets = {
    "Week 1": [],
    "Week 2": [],
    "Week 3": [],
    "Week 4": [],
  };

  SHOUTOUTS.forEach((s) => {
    const day = new Date(s.createdAt).getDate();
    let bucket = "Week 1";
    if (day > 7 && day <= 14) bucket = "Week 2";
    else if (day > 14 && day <= 21) bucket = "Week 3";
    else if (day > 21) bucket = "Week 4";
    weeklyBuckets[bucket].push(s);
  });

  const weeklyLabels = Object.keys(weeklyBuckets);
  const weeklyComments = weeklyLabels.map((label) =>
    weeklyBuckets[label].reduce(
      (sum, s) => sum + (s.commentsCount || 0),
      0
    )
  );
  const weeklyReactions = weeklyLabels.map((label) =>
    weeklyBuckets[label].reduce(
      (sum, s) => sum + (s.reactionsCount || 0),
      0
    )
  );
  const weeklyShoutouts = weeklyLabels.map(
    (label) => weeklyBuckets[label].length
  );

  const areaData = {
    labels: weeklyLabels,
    datasets: [
      {
        label: "Comments",
        data: weeklyComments,
        borderColor: "#f97316",
        backgroundColor: "rgba(249,115,22,0.2)",
        fill: true,
        tension: 0.3,
      },
      {
        label: "Reactions",
        data: weeklyReactions,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.2)",
        fill: true,
        tension: 0.3,
      },
      {
        label: "Shout-outs",
        data: weeklyShoutouts,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const areaOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" } },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
  };

  // ---------- DEPARTMENT ENGAGEMENT ----------
  const deptEngagement = DEPARTMENTS.map((dept) => {
    const deptEmployees = EMPLOYEES.filter(
      (emp) => emp.department === dept
    );
    const deptShoutouts = SHOUTOUTS.filter((s) =>
      deptEmployees.some((emp) => emp.id === s.from || emp.id === s.to)
    );
    const activeInDept = deptEmployees.filter((emp) =>
      deptShoutouts.some((s) => s.from === emp.id || s.to === emp.id)
    ).length;
    const rate =
      deptEmployees.length > 0
        ? Math.round((activeInDept / deptEmployees.length) * 100)
        : 0;
    return { label: dept, value: rate, shoutouts: deptShoutouts, activeInDept };
  });

  const pieData = {
    labels: deptEngagement.map((d) => d.label),
    datasets: [
      {
        data: deptEngagement.map((d) => d.value),
        backgroundColor: ["#22c55e", "#3b82f6", "#f97316", "#e11d48", "#8b5cf6"],
        borderWidth: 0,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" } },
  };

  // ---------- LOADING STATE ----------
  if (loading) {
    // Animated Tailwind placeholders
    return (
      <div className="p-6 text-black">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl bg-white shadow-sm p-4"
            >
              <div className="h-4 bg-slate-200 rounded w-1/2 mb-3" />
              <div className="h-7 bg-slate-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ---------- MAIN RENDER ----------
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-1">
          <span className="text-indigo-600 text-2xl">📊</span>
          Analytics
        </h1>
        <div className="flex flex-wrap gap-3">
          <select className="border border-slate-300 rounded-lg px-3 py-1 text-sm">
            <option>Report Type</option>
            <option>Top employees</option>
            <option>Engagement</option>
          </select>
          <select className="border border-slate-300 rounded-lg px-3 py-1 text-sm">
            <option>Date range</option>
            <option>This month</option>
            <option>Last month</option>
          </select>
          <button className="inline-flex items-center gap-2 rounded-lg bg-slate-900 text-white px-3 py-1.5 text-sm">
            📝 Export
          </button>
        </div>
      </header>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-gray-500">Total Shout-Outs</div>
          <div className="text-2xl font-bold">{totalShoutouts}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-gray-500">Top Tag</div>
          <div className="text-2xl font-bold">{topTag}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-gray-500">Active Users</div>
          <div className="text-2xl font-bold">{activeUsers}</div>
        </div>
      </div>

      {/* Top employees bar chart */}
      <section className="rounded-xl bg-white shadow-sm p-4">
        <h2 className="text-sm font-semibold text-slate-800">
          Top Most Active Employees
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Based on sent, received, comments, and reactions
        </p>
        <div className="mt-4 h-80">
          <Bar data={barData} options={barOptions} />
        </div>
      </section>

      {/* Bottom row: area chart + pie */}
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-xl bg-white shadow-sm p-4">
          <h2 className="text-sm font-semibold text-slate-800">
            Engagement Trends Over Time
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Weekly activity from createdAt, comments, and reactions
          </p>
          <div className="mt-4 h-64">
            <Line data={areaData} options={areaOptions} />
          </div>
        </section>

        <section className="rounded-xl bg-white shadow-sm p-4">
          <h2 className="text-sm font-semibold text-slate-800">
            Engagement Rate by Department
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Active members / total members
          </p>
          <div className="mt-4 h-64">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </section>
      </div>

      {/* Department-wise table */}
      <section className="rounded-xl bg-white shadow-sm p-4">
        <header className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800">
            Department-wise analytics
          </h2>
          <span className="text-xs text-slate-400">
            Shout-outs, active users & top tags
          </span>
        </header>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Department</th>
                <th className="px-4 py-2 text-left font-medium">Shout-outs</th>
                <th className="px-4 py-2 text-left font-medium">
                  Active users
                </th>
                <th className="px-4 py-2 text-left font-medium">Top tag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deptEngagement.map((dept) => {
                const deptTags = dept.shoutouts.map((s) => s.tag);
                const topDeptTag =
                  deptTags.length > 0
                    ? deptTags.reduce((a, b) =>
                        deptTags.filter((v) => v === a).length >=
                        deptTags.filter((v) => v === b).length
                          ? a
                          : b
                      )
                    : "N/A";
                return (
                  <tr key={dept.label}>
                    <td className="px-4 py-2">{dept.label}</td>
                    <td className="px-4 py-2">{dept.shoutouts.length}</td>
                    <td className="px-4 py-2">{dept.activeInDept}</td>
                    <td className="px-4 py-2">{topDeptTag}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default AnalyticsCards;
