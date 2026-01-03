// src/components/LeaderboardChart.jsx
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LeaderboardChart = ({ labels = [], data = [] }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Points",
        data,
        fill: true,
        backgroundColor: "rgba(99,102,241,0.15)",
        borderColor: "rgba(99,102,241,1)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true }
    }
  };

  return <Line data={chartData} options={options} />;
};

export default LeaderboardChart;