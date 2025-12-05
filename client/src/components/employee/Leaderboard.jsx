import React from "react";

const HIGHLIGHTED = [
  { name: "Sarah Johnson", dept: "Engineering", received: 47, sent: 22, score: 245, icon: "🥇" },
  { name: "Emily Rodriguez", dept: "Marketing", received: 71, sent: 29, score: 238, icon: "🥈" },
  { name: "David Kim", dept: "Employee", received: 45, sent: 18, score: 221, icon: "⭐" }
];

const LEADERBOARD = [
  { rank: 1, name: "Emily Rodriguez", dept: "Marketing", received: 71, sent: 29, score: 297 },
  { rank: 2, name: "Sarah Johnson", dept: "Engineering", received: 47, sent: 22, score: 295 },
  { rank: 3, name: "David Kim", dept: "Sales", received: 45, sent: 18, score: 279 },
  { rank: 4, name: "Sofia Lee", dept: "Engineering", received: 42, sent: 20, score: 270 },
  { rank: 5, name: "Michael Anderson", dept: "Sales", received: 36, sent: 15, score: 259 },
  { rank: 6, name: "Priya Patel", dept: "Product", received: 30, sent: 12, score: 248 },
  { rank: 7, name: "Alex Chen", dept: "Product", received: 28, sent: 10, score: 244 },
  { rank: 8, name: "Aarav White", dept: "HR", received: 24, sent: 9, score: 241 },
  { rank: 9, name: "Liam Thompson", dept: "Marketing", received: 22, sent: 8, score: 234 }
];

function Leaderboard() {
  return (
    <div className="leaderboard-container">
      <h2 className="title">🏆 Leaderboard</h2>

      {/* Highlighted Cards */}
      <div className="highlight-section">
        {HIGHLIGHTED.map((h, idx) => (
          <div key={idx} className="highlight-card">
            <div className="icon">{h.icon}</div>
            <strong className="name">{h.name}</strong>
            <div className="dept">{h.dept}</div>

            <div className="received">{h.received} Shoutouts Received</div>
            <div className="sent">{h.sent} Shoutouts Sent</div>
          </div>
        ))}
      </div>

      {/* Leaderboard Table */}
      <div className="table-wrapper">
        <h4 className="table-title">Monthly Leaderboard</h4>

        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Department</th>
              <th>Shoutouts Received</th>
              <th>Shoutouts Sent</th>
              <th>Total Score</th>
            </tr>
          </thead>

          <tbody>
            {LEADERBOARD.map((row, idx) => (
              <tr key={idx}>
                <td>{row.rank}</td>
                <td>{row.name}</td>
                <td>{row.dept}</td>
                <td>{row.received}</td>
                <td>{row.sent}</td>
                <td className="score">{row.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Styles */}
      <style>{`
        .leaderboard-container {
          padding: 40px 28px 40px 0;
          color: #333; 
        }

        .title {
          font-size: 28px;
          font-weight: 700;
          color: #4a0060;
        }

        .highlight-section {
          display: flex;
          gap: 16px;
          margin: 32px 0 24px;
        }

        .highlight-card {
          background: #f6f3ff;
          min-width: 185px;
          padding: 22px 18px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 3px 8px #d3c7ea;
          transition: 0.25s;
        }

        .highlight-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 5px 14px #c9b9f3;
        }

        .icon {
          font-size: 2.2em;
          margin-bottom: 6px;
        }

        .name {
          font-size: 1.1em;
        }

        .dept {
          color: #6e6a8d;
        }

        .received {
          margin-top: 10px;
          font-weight: 500;
          color: #333;
        }

        .sent {
          font-weight: 600;
          color: #800080;
        }

        .table-wrapper {
          background: #faf7ff;
          padding: 20px;
          border-radius: 14px;
          box-shadow: 0 3px 8px #ddd7f0;
          margin-top: 20px;
        }

        .table-title {
          color: #800080;
          margin-bottom: 14px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          padding: 12px;
          text-align: left;
          color: #8a55d3;
          font-weight: 600;
          background: #ece7f7;
          border-bottom: 2px solid #d6c9f3;
        }

        td {
          padding: 10px;
          color: #222;
          border-bottom: 1px solid #e6e2f1;
        }

        tr:nth-child(even) {
          background: #f9f7fc;
        }

        .score {
          font-weight: 600;
          color: #5b1aa8;
        }
      `}</style>
    </div>
  );
}

export default Leaderboard;
