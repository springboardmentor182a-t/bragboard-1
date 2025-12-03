import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChart = ({ data, height = 480 }) => {
  const labels = data.map((i) => i.name);
  const values = data.map((i) => i.count);

  return (
    <div style={{ height }}>
      <Doughnut
        data={{
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: [
                "#2563eb",
                "#10b981",
                "#f59e0b",
                "#ec4899",
                "#7c3aed",
              ],
              borderWidth: 1,
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

export default DonutChart;
