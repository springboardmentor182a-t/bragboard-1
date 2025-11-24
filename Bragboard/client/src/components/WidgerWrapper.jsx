import React from "react";

export default function WidgetWrapper({ id, title, onToggle, onOpenSettings, children }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      boxSizing: "border-box",
      padding: 8,
      borderRadius: 8,
      background: "white",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="widget-drag-handle" style={{ cursor: "move", padding: "4px 6px", background: "#eee", borderRadius: 4 }}>☰</span>
          <strong>{title}</strong>
        </div>
        <div>
          <button onClick={() => onOpenSettings(id)} style={{ marginRight: 8 }}>⚙</button>
          <button onClick={() => onToggle(id)}>Hide</button>
        </div>
      </div>
      <div style={{ flex: 1, overflow: "auto" }}>
        {children}
      </div>
    </div>
  );
}
