import React, { useState, useEffect } from "react";
import "./Settings.css"; // <-- Add CSS file

function Settings() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") return saved;
      if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    } catch (e) {
      // ignore localStorage errors
    }
    return "light";
  });
  const [dashboardDensity, setDashboardDensity] = useState("normal");
  const [notifications, setNotifications] = useState("all");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      if (typeof document !== "undefined") {
        document.body.classList.remove("theme-light", "theme-dark");
        document.body.classList.add(`theme-${theme}`);
      }
      localStorage.setItem("theme", theme);
    } catch (e) {
      // ignore storage errors
    }
  }, [theme]);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="settings-wrapper">

      <h2 className="settings-title">⚙️ Settings & Preferences</h2>

      <div className="settings-grid">

        {/* Theme */}
        <div className="settings-card">
          <h4>🎨 Theme</h4>
          <select value={theme} onChange={e => setTheme(e.target.value)}>
            <option value="light">🌞 Light</option>
            <option value="dark">🌙 Dark</option>
          </select>
        </div>

        {/* Density */}
        <div className="settings-card">
          <h4>📏 Dashboard Density</h4>
          <select
            value={dashboardDensity}
            onChange={e => setDashboardDensity(e.target.value)}
          >
            <option value="normal">Normal</option>
            <option value="compact">Compact</option>
            <option value="comfortable">Comfortable</option>
          </select>
        </div>

        {/* Notifications */}
        <div className="settings-card">
          <h4>🔔 Notifications</h4>
          <select
            value={notifications}
            onChange={e => setNotifications(e.target.value)}
          >
            <option value="all">All Notifications</option>
            <option value="important">Only Important</option>
          </select>
        </div>

      
      </div>

      <button className="save-btn" onClick={handleSave}>Save Settings</button>

      {saved && <span className="saved-text">✔ Settings Saved!</span>}
    </div>
  );
}

export default Settings;
