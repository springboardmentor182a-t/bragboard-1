import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./Reports.css";

function Reports() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="reports-content">
        <h1>REPORTING SHOUT-OUTS</h1>
        <p>Here you can view all shout-out reports.</p>
      </div>
    </div>
  );
}

export default Reports;
