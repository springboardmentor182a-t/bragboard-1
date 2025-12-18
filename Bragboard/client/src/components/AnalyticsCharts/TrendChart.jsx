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

const TrendChart = ({ data, height = 540 }) => {
  return (
    <div style={{ height }}>
      <Line
        data={{
          labels: data.map((_, i) => `Point ${i + 1}`),
          datasets: [
            {
              label: "Advanced Trend",
              data,
              borderColor: "#10b981",
              backgroundColor: "rgba(16, 185, 129, 0.3)",
              tension: 0.4,
              fill: true,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: "bottom" } },
        }}
      />
    </div>
  );
};

export default TrendChart;
