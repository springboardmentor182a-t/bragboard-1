import { motion } from "framer-motion";
import {
  Line,
  Pie,
  Bar
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  LineElement,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function PerformanceCharts() {
  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Performance Score",
        data: [70, 75, 90, 85, 92, 95],
        borderColor: "rgb(37, 99, 235)",
        backgroundColor: "rgba(37, 99, 235, 0.3)",
        tension: 0.4,
      }
    ]
  };

  const pieData = {
    labels: ["Completed", "Pending", "In-Progress"],
    datasets: [
      {
        data: [10, 4, 3],
        backgroundColor: [
          "rgb(34,197,94)",
          "rgb(239,68,68)",
          "rgb(59,130,246)"
        ],
      }
    ]
  };

  const barData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Hours Worked",
        data: [6, 7, 8, 5, 9],
        backgroundColor: "rgba(37, 99, 235, 0.8)"
      }
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
    >
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-bold mb-3 text-blue-600">Performance Trend</h2>
        <Line data={lineData} />
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-bold mb-3 text-blue-600">Task Breakdown</h2>
        <Pie data={pieData} />
      </div>

      <div className="bg-white p-6 rounded-xl shadow md:col-span-2">
        <h2 className="text-lg font-bold mb-3 text-blue-600">Weekly Activity</h2>
        <Bar data={barData} />
      </div>
    </motion.div>
  );
}
