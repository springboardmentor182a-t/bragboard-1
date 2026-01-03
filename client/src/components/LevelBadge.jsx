import React from "react";

export default function LevelBadge({ level }) {
  const badges = {
    Bronze:  { emoji: "🥉", color: "#cd7f32" },
    Silver:  { emoji: "🥈", color: "#C0C0C0" },
    Gold:    { emoji: "🥇", color: "#FFD700" },
    Diamond: { emoji: "💎", color: "#74d0f1" }
  };

  const data = badges[level] || badges["Bronze"];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 10px",
        borderRadius: "20px",
        background: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
        fontSize: "14px",
        fontWeight: 600,
      }}
    >
      <span style={{ fontSize: "18px" }}>{data.emoji}</span>
      <span style={{ color: data.color }}>{level}</span>
    </span>
  );
}
