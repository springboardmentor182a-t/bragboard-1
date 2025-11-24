import React from "react";
import { Bar } from "react-chartjs-2";

function DepartmentAnalytics({ filter = "weekly", settings = {} }) {
  const dataSets = {
    weekly: [40,25,15,20],
    monthly: [400,250,150,200],
    quarterly: [1200,900,600,800],
    yearly: [4800,3600,2400,3200],
    overall: [10000,7000,5000,8000]
  };
  const labels = ["IT","HR","Admin","Finance"];
  const data = {
    labels,
    datasets: [{ label: settings.title || `Tags by Dept (${filter})`, data: dataSets[filter] || dataSets.weekly, backgroundColor: settings.colorArray || ["#4A90E2","#50C878","#F39C12","#9B59B6"] }]
  };
  return (
    <div className="graph-box">
      <h3>{settings.title || "Department-wise Analytics"}</h3>
      <Bar data={data} />
    </div>
  );
}

export default DepartmentAnalytics;
