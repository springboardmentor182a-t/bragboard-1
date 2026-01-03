import "./XPBar.css";

export default function XPBar({ progress = 0 }) {
  // Ensure progress is between 0 and 1
  const safe = Math.max(0, Math.min(1, progress));
  const pct = Math.round(safe * 100);

  return (
    <div className="xp-wrapper">
      <div className="xp-track">
        <div className="xp-bar" style={{ width: pct + "%" }}></div>
      </div>
      <span className="xp-label">{pct}%</span>
    </div>
  );
}
