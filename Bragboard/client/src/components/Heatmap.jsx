import React from "react";

/**
 * Lightweight visual heatmap: small vertical bars representing activity
 */
export default function Heatmap({ data = [20, 30, 15, 45, 25], labels = ["Mon","Tue","Wed","Thu","Fri"] }) {
  return (
    <div className="graph-box">
      <h3>Activity Heatmap</h3>
      <div style={{ display: "flex", alignItems: "end", gap: 8, padding: "12px 0" }}>
        {data.map((v, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{
              width: 36,
              height: Math.max(6, v * 2),
              background: `rgba(74,144,226, ${Math.min(1, v / 50)})`,
              borderRadius: 4,
              marginBottom: 6
            }} />
            <div style={{ fontSize: 12 }}>{labels[i]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

