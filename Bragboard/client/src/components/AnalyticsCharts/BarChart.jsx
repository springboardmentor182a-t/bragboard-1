import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarChart = ({ data }) => {
  const labels = data.map((i) => i.name);
  const values = data.map((i) => i.shoutouts);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Bar
        data={{
          labels,
          datasets: [
            {
              label: "Shoutouts",
              data: values,
              backgroundColor: "#2563eb",
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { grid: { display: false }, border: { display: false } },
            x: { grid: { display: false }, border: { display: false } },
          },
        }}
      />
    </div>
  );
};

export default BarChart;
