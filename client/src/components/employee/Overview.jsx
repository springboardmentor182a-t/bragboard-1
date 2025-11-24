import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Recent shoutouts data
const recentShoutouts = [
  { name: "Rani", msg: "Great teamwork on the last project! 🎉", avatar: "🧑‍🎨" },
  { name: "Raj", msg: "Outstanding leadership in Q4 goals! 👏", avatar: "👨‍💼" }
];

// Performance graph data
const perfData = [
  { month: "June", score: 70 },
  { month: "July", score: 75 },
  { month: "Aug", score: 80 },
  { month: "Sep", score: 87 },
  { month: "Oct", score: 90 }
];

function Overview() {
  return (
    <div>
      <h3>Overview / Quick Stats</h3>
      <div style={{ display: "flex", gap: "24px", marginTop: "30px" }}>
        <div style={cardStyle}>
          <h4 style={{ color: "#800080" }}>Attendance summary</h4>
          <div>Present: 20 | Absent: 1 | Leave: 3</div>
        </div>
        <div style={cardStyle}>
          <h4 style={{ color: "#800080" }}>Total working hours</h4>
          <div>160 hours (monthly)</div>
        </div>
        <div style={cardStyle}>
          <h4 style={{ color: "#800080" }}>Upcoming holidays</h4>
          <div>2 holidays</div>
        </div>
        <div style={cardStyle}>
          <h4 style={{ color: "#800080" }}>Assigned tasks count</h4>
          <div>5 tasks</div>
        </div>
      </div>

      {/* Recent Shoutouts */}
      <div style={{ marginTop: "40px", marginBottom: 0 }}>
        <h4 style={{ color: "#800080" }}>🔔 Recent Employee Shoutouts</h4>
        <div style={{ display: "flex", gap: "28px", marginTop: "14px" }}>
          {recentShoutouts.map((sh, idx) => (
            <div key={idx} style={{
              background: "#f6eff8",
              padding: "18px 22px",
              borderRadius: "10px",
              minWidth: "220px",
              display: "flex", alignItems: "center"
            }}>
              <span style={{ fontSize: "2em", marginRight: "10px" }}>{sh.avatar}</span>
              <div>
                <strong>{sh.name}</strong>
                <div>{sh.msg}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Graph */}
      <div style={{ marginTop: "60px", maxWidth: "540px", background: "#f3f4f8", borderRadius: "12px", padding: "24px" }}>
        <h4 style={{ color: "#800080", marginBottom: "20px" }}>📊 Performance (last 5 months)</h4>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={perfData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="score" fill="#800080" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p style={{ marginTop: "32px" }}>Performance summary and team stats go here (role-based display coming soon).</p>
    </div>
  );
}

// Card styling for stats cards
const cardStyle = {
  background: "#f4f4f4",
  padding: "28px",
  borderRadius: "10px",
  boxShadow: "0 2px 6px #0002",
  color: "#222"
};

export default Overview;
