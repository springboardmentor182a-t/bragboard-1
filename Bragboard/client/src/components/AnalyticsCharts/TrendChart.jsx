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

const TrendChart = ({ data }) => {
  return (
    <div style={{ height: "100%", width: "100%" }}>
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
          interaction: { mode: 'index', intersect: false },
          plugins: { legend: { position: 'bottom', align: 'end', labels: { boxWidth: 10, usePointStyle: true } } },
          scales: {
            y: { grid: { display: true, color: 'rgba(0,0,0,0.05)' }, border: { display: false } },
            x: { grid: { display: false }, border: { display: false } },
          },
          elements: {
            point: { radius: 0, hitRadius: 10, hoverRadius: 5 },
            line: { tension: 0.4 },
          },
        }}
      />
    </div>
  );
};

export default TrendChart;
