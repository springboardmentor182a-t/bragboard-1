import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const perfData = [
  { month: "Jan", score: 75, attendance: 96, tasks: 18 },
  { month: "Feb", score: 80, attendance: 98, tasks: 22 },
  { month: "Mar", score: 70, attendance: 90, tasks: 16 },
  { month: "Apr", score: 85, attendance: 99, tasks: 27 },
  { month: "May", score: 90, attendance: 97, tasks: 25 },
];

// Mock achievements
const achievements = [
  "Achieved monthly target for tasks completed",
  "Received positive client feedback on April project",
  "Attendance streak: 30 days present in a row"
];

function Performance() {
  // Show main metric trend (score comparison)
  const delta = perfData[perfData.length - 1].score - perfData[perfData.length - 2].score;
  const trend = delta >= 0 ? "▲" : "▼";

  // Goals input (demo)
  const [newGoal, setNewGoal] = useState("");
  const [goals, setGoals] = useState([
    "Complete 30 tasks next month",
    "Maintain attendance above 97%",
    "Participate in skill-building workshop"
  ]);

  function addGoal(e) {
    e.preventDefault();
    if (newGoal) {
      setGoals([newGoal, ...goals]);
      setNewGoal("");
    }
  }

  return (
    <div>
      <h3>Performance & Analytics</h3>
      {/* KPI Data Cards */}
      <div style={{ display: "flex", gap: "22px", marginBottom: "24px", marginTop: "10px" }}>
        <div style={cardStyle}>
          <strong>Performance Score</strong>
          <div style={{ fontSize: 26, color: "#800080", fontWeight: 600 }}>{perfData[4].score} {trend}</div>
          <div style={{ color: delta >= 0 ? "#097c2d" : "#c00", fontSize: 14 }}>
            {delta >= 0 ? "Up" : "Down"} {Math.abs(delta)} from last month
          </div>
        </div>
        <div style={cardStyle}>
          <strong>Attendance Rate</strong>
          <div style={{ fontSize: 26, color: "#2141b2", fontWeight: 600 }}>{perfData[4].attendance}%</div>
        </div>
        <div style={cardStyle}>
          <strong>Tasks Completed</strong>
          <div style={{ fontSize: 26, color: "#099c70", fontWeight: 600 }}>{perfData[4].tasks}</div>
        </div>
      </div>
      {/* Performance Graph */}
      <div style={{
        width: "100%", minWidth: "350px", height: "320px", maxWidth: "600px",
        marginTop: "20px", background: "#f5f5f5", padding: "20px", borderRadius: "10px"
      }}>
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={perfData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="score" fill="#800080" name="Score" />
            <Bar dataKey="tasks" fill="#097c2d" name="Tasks" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Achievements */}
      <div style={{ marginTop: "34px", background: "#efeaf8", padding: "18px", borderRadius: "10px", maxWidth: 480 }}>
        <strong>Recent Achievements:</strong>
        <ul>
          {achievements.map((a, i) => (
            <li key={i} style={{ marginBottom: "7px" }}>{a}</li>
          ))}
        </ul>
      </div>
      {/* Goals section */}
      <div style={{ marginTop: "30px", background: "#f8f3fa", padding: "16px", borderRadius: "10px", maxWidth: 480 }}>
        <strong>Goals for Next Month:</strong>
        <form onSubmit={addGoal} style={{ marginBottom: "8px" }}>
          <input
            type="text"
            value={newGoal}
            onChange={e => setNewGoal(e.target.value)}
            placeholder="Set a new goal"
            style={{
              marginRight: "9px", padding: "8px", border: "1px solid #80008060", borderRadius: "5px", width: 220
            }}
          />
          <button
            type="submit"
            style={{
              background: "#800080", color: "#fff", border: "none",
              padding: "8px 14px", borderRadius: "4px", fontWeight: 500
            }}>
            Add Goal
          </button>
        </form>
        <ul>
          {goals.map((goal, idx) => (
            <li key={idx} style={{ marginBottom: "5px" }}>{goal}</li>
          ))}
        </ul>
      </div>
      <p style={{ marginTop: "22px" }}>Monthly performance, attendance, tasks and personal goals tracked here.</p>
    </div>
  );
}

const cardStyle = {
  background: "#f4f4f4",
  padding: "20px",
  borderRadius: "10px",
  color: "#222",
  boxShadow: "0 2px 6px #0002",
  minWidth: "170px"
};

export default Performance;
