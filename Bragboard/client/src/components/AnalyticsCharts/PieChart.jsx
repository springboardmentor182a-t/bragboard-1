import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data }) => {
  const labels = data.map((i) => i.name);
  const values = data.map((i) => i.count);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Pie
        data={{
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: [
                "#f59e0b",
                "#2563eb",
                "#10b981",
                "#ec4899",
                "#7c3aed",
              ],
              borderWidth: 1,
            },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          responsive: true,
          plugins: { legend: { position: "bottom", labels: { boxWidth: 12, usePointStyle: true, padding: 20 } } },
        }}
      />
    </div>
  );
};

export default PieChart;
