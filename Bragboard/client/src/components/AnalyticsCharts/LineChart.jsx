import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const LineChart = ({ data }) => {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Line
        data={{
          labels: data.map((_, i) => `Day ${i + 1}`),
          datasets: [
            {
              label: "Trend",
              data,
              borderColor: "#2563eb",
              backgroundColor: "rgba(37, 99, 235, 0.4)",
              tension: 0.4,
              fill: true,
            },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }, // Hide legend for cleaner look
          scales: {
            y: { grid: { display: true, color: 'rgba(0,0,0,0.05)' }, border: { display: false } },
            x: { grid: { display: false }, border: { display: false } },
          },
          elements: {
            point: { radius: 0, hitRadius: 10, hoverRadius: 5 }, // No dots by default
          },
        }}
      />
    </div>
  );
};

export default LineChart;
