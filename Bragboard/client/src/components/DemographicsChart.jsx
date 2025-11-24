import React from "react";
import { Pie } from "react-chartjs-2";

export default function DemographicsChart({ data = { IT:40, HR:32, Admin:28 } }) {
  const labels = Object.keys(data);
  const values = Object.values(data);
  const dataset = {
    labels,
    datasets: [{ data: values, backgroundColor: ["#4A90E2","#F39C12","#9B59B6"] }]
  };
  return (
    <div className="graph-box">
      <h3>User Demographics</h3>
      <Pie data={dataset} />
    </div>
  );
}
