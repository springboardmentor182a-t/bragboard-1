import React from "react";

const HIGHLIGHTED = [
  {
    name: "Sarah Johnson",
    dept: "Engineering",
    shoutouts: 47,
    reactions: 245,
    icon: "🥇"
  },
  {
    name: "Emily Rodriguez",
    dept: "Marketing",
    shoutouts: 71,
    reactions: 238,
    icon: "🥈"
  },
  {
    name: "David Kim",
    dept: "Employee",
    shoutouts: 45,
    reactions: 221,
    icon: "⭐"
  }
];

const LEADERBOARD = [
  { rank: 1, name: "Emily Rodriguez", dept: "Marketing", shoutouts: 71, received: 238, score: 297 },
  { rank: 2, name: "Sarah Johnson", dept: "Engineering", shoutouts: 47, received: 245, score: 295 },
  { rank: 3, name: "David Kim", dept: "Sales", shoutouts: 45, received: 221, score: 279 },
  { rank: 4, name: "Sofia Lee", dept: "Engineering", shoutouts: 42, received: 210, score: 270 },
  { rank: 5, name: "Michael Anderson", dept: "Sales", shoutouts: 36, received: 201, score: 259 },
  { rank: 6, name: "Priya Patel", dept: "Product", shoutouts: 30, received: 180, score: 248 },
  { rank: 7, name: "Alex Chen", dept: "Product", shoutouts: 28, received: 155, score: 244 },
  { rank: 8, name: "Aarav White", dept: "HR", shoutouts: 24, received: 142, score: 241 },
  { rank: 9, name: "Liam Thompson", dept: "Marketing", shoutouts: 22, received: 134, score: 234 }
];

function Leaderboard() {
  return (
    <div style={{ padding: "40px 28px 40px 0" }}>
      <h2>🏆 Leaderboard</h2>

      {/* Top Employees */}
      <div style={{ display: "flex", gap: "14px", margin: "32px 0 24px" }}>
        {HIGHLIGHTED.map((h, idx) => (
          <div key={idx} style={{
            background: "#f6f6fa",
            minWidth: "185px",
            padding: "22px 18px",
            borderRadius: "12px",
            textAlign: "center",
            boxShadow: "0 2px 7px #ccc2"
          }}>
            <div style={{ fontSize: "2.2em", marginBottom: "6px" }}>{h.icon}</div>
            <strong>{h.name}</strong>
            <div style={{ color: "#6e6a8d" }}>{h.dept}</div>
            <div style={{ fontWeight: 500, marginTop: "11px" }}>
              {h.shoutouts} Shoutouts Received
            </div>
            <div style={{ color: "#800080", fontWeight: 500 }}>{h.reactions} Reactions</div>
          </div>
        ))}
      </div>

      {/* Monthly leaderboard table */}
      <div style={{ marginTop: "18px", background: "#f7f7fc", borderRadius: "14px", padding: "18px", boxShadow: "0 2px 7px #dddb" }}>
        <h4 style={{ color: "#800080", marginBottom: "14px" }}>Monthly Leaderboard</h4>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "1em" }}>
          <thead style={{ background: "#ece9f2" }}>
            <tr>
              <th style={tHeadCell}>Rank</th>
              <th style={tHeadCell}>Name</th>
              <th style={tHeadCell}>Department</th>
              <th style={tHeadCell}>Shoutouts Received</th>
              <th style={tHeadCell}>Shoutouts Sent</th>
              <th style={tHeadCell}>Total Score</th>
            </tr>
          </thead>
          <tbody>
            {LEADERBOARD.map((row, idx) => (
              <tr key={row.rank} style={{ background: idx % 2 === 0 ? "#fff" : "#f3f1f7" }}>
                <td style={tCell}>{row.rank}</td>
                <td style={tCell}>{row.name}</td>
                <td style={tCell}>{row.dept}</td>
                <td style={tCell}>{row.shoutouts}</td>
                <td style={tCell}>{row.received}</td>
                <td style={tCell}>{row.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Table cell styles
const tHeadCell = { padding: "10px 10px", color: "#8559d6", fontWeight: 600, fontSize: "1em", textAlign: "left" };
const tCell = { padding: "8px 10px", color: "#222", fontWeight: 400, textAlign: "left" };

export default Leaderboard;
