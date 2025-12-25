import './EmpSidebar.css';

function EmpSidebar({ activeSection, setActiveSection }) {
  const items = [
    { id: "tasks", label: "Tasks & Projects" },
    { id: "shoutouts", label: "Shoutouts" },
    { id: "attendance", label: "Attendance & Leave" },
    { id: "leaderboard", label: "Leaderboard" },
    { id: "notifications", label: "Notifications" },
    { id: "profile", label: "Profile & Documents" },
    { id: "performance", label: "Performance & Analytics" },
    { id: "settings", label: "Settings" }
  ];

  return (
    <div className="sidebar">   {/* <-- USE YOUR CUSTOM CLASS */}
      <h2>Employee Dashboard</h2>

      <ul>
        {items.map(item => (
          <li
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={activeSection === item.id ? "active-item" : ""}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EmpSidebar;
