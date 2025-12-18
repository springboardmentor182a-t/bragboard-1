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

const LineChart = ({ data, height = 540 }) => {
  return (
    <div style={{ height }}>
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
          plugins: { legend: { position: "bottom" } },
        }}
      />
    </div>
  );
};

export default LineChart;
