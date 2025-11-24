import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AnalyticsChart({ filter = "weekly", settings = {} }) {
  const dataSets = {
    weekly: [10,20,30,40,25],
    monthly: [200,150,300,400,350],
    quarterly: [800,700,950,1000,900],
    yearly: [3000,3500,4000,4200,5000],
    overall: [5000,6000,7000,6500,8000]
  };
  const dataset = dataSets[filter] || dataSets.weekly;
  const data = {
    labels: ["Mon","Tue","Wed","Thu","Fri"],
    datasets: [{ label: settings.title || `Tags (${filter})`, data: dataset, backgroundColor: settings.color || "rgba(75,192,192,0.7)" }]
  };
  return (
    <div className="graph-box">
      <h3>{settings.title || "Analytics Chart"}</h3>
      <Bar data={data} />
    </div>
  );
}
export default AnalyticsChart;
