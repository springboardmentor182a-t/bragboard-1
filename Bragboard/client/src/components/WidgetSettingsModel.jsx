import React, { useEffect, useState } from "react";

export default function WidgetSettingsModal({ open, widgetId, settingsMap = {}, onClose, onSave }) {
  const [local, setLocal] = useState({ title: "", color: "", threshold: "" });

  useEffect(() => {
    if (widgetId) {
      setLocal(settingsMap[widgetId] || { title: "", color: "", threshold: "" });
    }
  }, [widgetId, settingsMap]);

  if (!open) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
      display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999
    }}>
      <div style={{ width: 420, background: "white", padding: 16, borderRadius: 8 }}>
        <h3 style={{ marginTop: 0 }}>Settings — {widgetId}</h3>

        <label>Title</label>
        <input style={{ width: "100%", marginBottom: 8 }} value={local.title || ""} onChange={(e) => setLocal({ ...local, title: e.target.value })} />

        <label>Accent Color (hex)</label>
        <input style={{ width: "100%", marginBottom: 8 }} value={local.color || ""} onChange={(e) => setLocal({ ...local, color: e.target.value })} />

        <label>Threshold (optional)</label>
        <input style={{ width: "100%", marginBottom: 12 }} value={local.threshold || ""} onChange={(e) => setLocal({ ...local, threshold: e.target.value })} />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={() => { onSave(widgetId, local); onClose(); }}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
