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

const BarChart = ({ data, height = 520 }) => {
  const labels = data.map((i) => i.name);
  const values = data.map((i) => i.shoutouts);

  return (
    <div style={{ height }}>
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
        }}
      />
    </div>
  );
};

export default BarChart;
