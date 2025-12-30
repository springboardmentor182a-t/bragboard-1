import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// --- mock performance data (same as Performance.jsx) ---
const perfData = [
  { month: "Jan", score: 75 },
  { month: "Feb", score: 80 },
  { month: "Mar", score: 70 },
  { month: "Apr", score: 85 },
  { month: "May", score: 90 },
];

// --- top leaderboard people ---
const TOP_PEOPLE = [
  { name: "Emily Rodriguez", dept: "Marketing", score: 297 },
  { name: "Sarah Johnson", dept: "Engineering", score: 295 },
  { name: "David Kim", dept: "Sales", score: 279 },
];

// --- recent shoutouts ---
const RECENT_SHOUTOUTS = [
  { from: "Sarah Johnson", to: "David Kim", msg: "Great job on the presentation!" },
  { from: "Emily Rodriguez", to: "Priya Patel", msg: "Amazing teamwork this sprint!" },
  { from: "Alex Chen", to: "Michael Anderson", msg: "Thanks for the support!" },
];

function Overview() {
  return (
    <div style={{ padding: "30px", maxWidth: "1200px" }}>
      <h2 style={{ fontSize: "28px", fontWeight: 700, color: "#7c3aed", marginBottom: "24px" }}>
        Employee Overview
      </h2>

      {/* 🔹 Top summary cards */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "30px" }}>
        {[
          { label: "Total Shoutouts", value: 124 },
          { label: "Shoutouts Received", value: 68 },
          { label: "Shoutouts Given", value: 56 },
        ].map((c) => (
          <div
            key={c.label}
            style={{
              background: "#fff",
              padding: "22px",
              borderRadius: "12px",
              minWidth: "220px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ fontSize: "16px", color: "#6b7280" }}>{c.label}</div>
            <div style={{ fontSize: "32px", color: "#7c3aed", fontWeight: 700 }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* 🔹 Performance graph */}
      <div
        style={{
          background: "#faf5ff",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "30px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ color: "#7c3aed", marginBottom: "12px" }}>
          Performance Trend
        </h3>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={perfData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="score" fill="#7c3aed" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🔹 Bottom section */}
      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        {/* Leaderboard */}
        <div style={cardStyle}>
          <h3 style={titleStyle}>Top Performers</h3>
          {TOP_PEOPLE.map((p, i) => (
            <div key={i} style={rowStyle}>
              <strong>{p.name}</strong>
              <span style={{ color: "#6b7280" }}>{p.dept}</span>
              <span style={{ color: "#7c3aed", fontWeight: 600 }}>{p.score}</span>
            </div>
          ))}
        </div>

        {/* Recent shoutouts */}
        <div style={cardStyle}>
          <h3 style={titleStyle}>Recent Shoutouts</h3>
          {RECENT_SHOUTOUTS.map((s, i) => (
            <div key={i} style={{ marginBottom: "12px" }}>
              <strong>{s.from}</strong> → <strong>{s.to}</strong>
              <div style={{ fontSize: "13px", color: "#374151" }}>{s.msg}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#ffffff",
  padding: "20px",
  borderRadius: "12px",
  flex: 1,
  minWidth: "300px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
};

const titleStyle = {
  color: "#7c3aed",
  marginBottom: "14px",
  fontWeight: 600,
};

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "10px",
};

export default Overview;
