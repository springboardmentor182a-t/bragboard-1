import React, { useState, useEffect } from "react";

function Settings() {
  const [theme, setTheme] = useState("light");
  const [dashboardDensity, setDashboardDensity] = useState("normal");
  const [notifications, setNotifications] = useState("all");
  const [language, setLanguage] = useState("en");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    document.body.classList.remove("theme-light", "theme-dark");
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <h3>Settings / Preferences</h3>
      <div className="card">
        <label>
          <strong>Theme:</strong>
          <select
            value={theme}
            onChange={e => setTheme(e.target.value)}
            style={{ marginLeft: "10px" }}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
      </div>
      <div className="card">
        <label>
          <strong>Dashboard Density:</strong>
          <select
            value={dashboardDensity}
            onChange={e => setDashboardDensity(e.target.value)}
            style={{ marginLeft: "10px" }}
          >
            <option value="normal">Normal</option>
            <option value="compact">Compact</option>
            <option value="comfortable">Comfortable</option>
          </select>
        </label>
      </div>
      <div className="card">
        <label>
          <strong>Notifications:</strong>
          <select
            value={notifications}
            onChange={e => setNotifications(e.target.value)}
            style={{ marginLeft: "10px" }}
          >
            <option value="all">All</option>
            <option value="important">Only important</option>
          </select>
        </label>
      </div>
      <div className="card">
        <label>
          <strong>Language:</strong>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            style={{ marginLeft: "10px" }}
          >
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </label>
      </div>
      <button onClick={handleSave}>Save Settings</button>
      {saved && <span style={{ marginLeft: "18px", color: "var(--accent)" }}>Saved!</span>}
      <p style={{ marginTop: "20px" }}>
        Personalize your dashboard, choose light/dark mode, language, notification preferences, and display density.
      </p>
    </div>
  );
}

export default Settings;
