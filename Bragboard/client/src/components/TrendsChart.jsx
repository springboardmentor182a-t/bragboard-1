import { Line } from "react-chartjs-2";

function TrendsChart() {
  const actual = [10, 20, 30, 25, 35];
  const predicted = [12, 22, 32, 30, 40];

  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      { label: "Actual", data: actual, borderColor: "blue" },
      { label: "Predicted", data: predicted, borderColor: "green" }
    ]
  };

  return (
    <div className="graph-box">
      <h3>Predictive Trends</h3>
      <Line data={data} />
    </div>
  );
}

export default TrendsChart;
