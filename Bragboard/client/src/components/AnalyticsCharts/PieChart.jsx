import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data, height = 480 }) => {
  const labels = data.map((i) => i.name);
  const values = data.map((i) => i.count);

  return (
    <div style={{ height }}>
      <Pie
        data={{
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: [
                "#3b82f6",
                "#10b981",
                "#f59e0b",
                "#ef4444",
                "#8b5cf6",
              ],
            },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          plugins: { legend: { position: "bottom" } },
        }}
      />
    </div>
  );
};

export default PieChart;
