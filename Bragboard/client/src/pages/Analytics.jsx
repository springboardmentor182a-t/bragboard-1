import React, { useState } from "react";
import DashboardLayout from "../components/Layout/DashboardLayout.jsx";
import DonutChart from "../components/AnalyticsCharts/DonutChart";
import PieChart from "../components/AnalyticsCharts/PieChart";
import BarChart from "../components/AnalyticsCharts/BarChart";
import LineChart from "../components/AnalyticsCharts/LineChart";
import TrendChart from "../components/AnalyticsCharts/TrendChart";

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [range, setRange] = useState("week");
  const [view, setView] = useState("donut");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  /** ANALYTICS DATA */
  const analytics = {
    week: {
      shoutoutsSent: 12,
      reactionsReceived: 36,
      commentsMade: 8,
      contributors: [
        { name: "John Smith", count: 15 },
        { name: "Mike Chen", count: 12 },
        { name: "Alex Rivera", count: 10 },
      ],
      mostTagged: [
        { name: "Sarah Lee", count: 7 },
        { name: "Jane Doe", count: 5 },
        { name: "Tom White", count: 4 },
      ],
      departments: [
        { name: "Engineering", shoutouts: 45 },
        { name: "Sales", shoutouts: 32 },
        { name: "Marketing", shoutouts: 28 },
        { name: "Design", shoutouts: 19 },
      ],
      trend: [5, 7, 6, 9, 8, 10, 11],
    },

    month: {
      shoutoutsSent: 42,
      reactionsReceived: 128,
      commentsMade: 35,
      contributors: [
        { name: "John Smith", count: 58 },
        { name: "Mike Chen", count: 45 },
        { name: "Alex Rivera", count: 35 },
      ],
      mostTagged: [
        { name: "Kevin Patel", count: 14 },
        { name: "Sarah Lee", count: 10 },
        { name: "Jane Doe", count: 9 },
      ],
      departments: [
        { name: "Engineering", shoutouts: 165 },
        { name: "Sales", shoutouts: 142 },
        { name: "Marketing", shoutouts: 98 },
        { name: "Design", shoutouts: 76 },
      ],
      trend: [6, 8, 7, 10, 9, 11, 12],
    },

    quarter: {
      shoutoutsSent: 120,
      reactionsReceived: 350,
      commentsMade: 96,
      contributors: [
        { name: "John Smith", count: 140 },
        { name: "Mike Chen", count: 115 },
        { name: "Alex Rivera", count: 100 },
      ],
      mostTagged: [
        { name: "Sarah Lee", count: 28 },
        { name: "Jane Doe", count: 21 },
        { name: "Kevin Patel", count: 18 },
      ],
      departments: [
        { name: "Engineering", shoutouts: 410 },
        { name: "Sales", shoutouts: 290 },
        { name: "Marketing", shoutouts: 225 },
        { name: "Design", shoutouts: 160 },
      ],
      trend: [10, 12, 11, 15, 17, 18, 19],
    },

    year: {
      shoutoutsSent: 520,
      reactionsReceived: 1460,
      commentsMade: 420,
      contributors: [
        { name: "John Smith", count: 530 },
        { name: "Mike Chen", count: 488 },
        { name: "Alex Rivera", count: 445 },
      ],
      mostTagged: [
        { name: "Kevin Patel", count: 65 },
        { name: "Sarah Lee", count: 56 },
        { name: "Jane Doe", count: 54 },
      ],
      departments: [
        { name: "Engineering", shoutouts: 1450 },
        { name: "Sales", shoutouts: 1090 },
        { name: "Marketing", shoutouts: 830 },
        { name: "Design", shoutouts: 760 },
      ],
      trend: [20, 25, 22, 30, 32, 35, 38],
    },
  };

  const current = analytics[range];

  const applyCustomRange = () => {
    if (!startDate || !endDate) {
      alert("Please select both dates!");
      return;
    }
    alert(`Custom Filter Applied: ${startDate} → ${endDate}`);
  };

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="p-6 bg-[#f0f6ff] dark:bg-gray-900 min-h-screen transition-colors duration-200">

        {/* HEADER */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6 flex flex-col gap-6 transition-colors duration-200">

          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Dashboard Analytics</h1>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">

            {/* Left: Range Selection (Segmented Control) */}
            <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-lg inline-flex">
              {["week", "month", "quarter", "year"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${range === r
                    ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    }`}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>

            {/* Right: Filters & Actions */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <select
                value={view}
                onChange={(e) => setView(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]"
              >
                <option value="donut">Top Contributors</option>
                <option value="pie">Most Tagged</option>
                <option value="bar">Departments</option>
                <option value="line">Weekly Trend</option>
                <option value="trend">Advanced Trend</option>
                <option value="all">All Charts</option>
              </select>

              <div className="flex items-center bg-gray-50 dark:bg-gray-900/50 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center border-r border-gray-200 dark:border-gray-700 pr-2">
                  <span className="text-xs text-gray-400 font-medium px-2">From</span>
                  <input
                    type="date"
                    className="bg-transparent border-none text-sm px-1 py-1 text-gray-700 dark:text-gray-300 focus:ring-0"
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="flex items-center pl-2">
                  <span className="text-xs text-gray-400 font-medium px-2">To</span>
                  <input
                    type="date"
                    className="bg-transparent border-none text-sm px-1 py-1 text-gray-700 dark:text-gray-300 focus:ring-0"
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <button
                onClick={applyCustomRange}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 w-full">

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center transition-colors duration-200 flex flex-col items-center justify-center">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{current.shoutoutsSent}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">Shout-outs Sent</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center transition-colors duration-200 flex flex-col items-center justify-center">
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{current.reactionsReceived}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">Reactions Received</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center transition-colors duration-200 flex flex-col items-center justify-center">
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{current.commentsMade}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">Comments Made</p>
          </div>

        </div>

        {/* CHART AREA */}
        <div className="w-full">
          {view === "all" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
              <ChartCard title="Top Contributors">
                <DonutChart data={current.contributors} />
              </ChartCard>
              <ChartCard title="Most Tagged Users">
                <PieChart data={current.mostTagged} />
              </ChartCard>
              <ChartCard title="Department Performance">
                <BarChart data={current.departments} />
              </ChartCard>
              <ChartCard title="Weekly Trend">
                <LineChart data={current.trend} />
              </ChartCard>
              <ChartCard title="Advanced Analytics" className="md:col-span-2">
                <TrendChart data={current.trend} />
              </ChartCard>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <ChartCard title={
                view === "donut" ? "Top Contributors" :
                  view === "pie" ? "Most Tagged Users" :
                    view === "bar" ? "Department Performance" :
                      view === "line" ? "Weekly Trend" : "Advanced Analytics"
              }>
                {view === "donut" && <DonutChart data={current.contributors} />}
                {view === "pie" && <PieChart data={current.mostTagged} />}
                {view === "bar" && <BarChart data={current.departments} />}
                {view === "line" && <LineChart data={current.trend} />}
                {view === "trend" && <TrendChart data={current.trend} />}
              </ChartCard>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

// Reusable Chart Card Component with height constraint
const ChartCard = ({ title, children, className = "" }) => (
  <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200 flex flex-col ${className}`}>
    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{title}</h3>
    <div className="h-64 w-full relative flex items-center justify-center">
      {children}
    </div>
  </div>
);

export default Analytics;
