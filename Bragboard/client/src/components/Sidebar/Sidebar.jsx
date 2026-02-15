// client/src/components/Sidebar/Sidebar.jsx
import React from "react";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>BRAG BOARD</h2>
      <div className="menu">
        <button>Dashboard</button>
        <button>Reports</button>
        <button>Shout-Outs</button>
        <button>Settings</button>
      </div>
    </div>
  );
}

export default Sidebar;
