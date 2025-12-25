<<<<<<< HEAD
import './EmpSidebar.css';

function EmpSidebar({ activeSection, setActiveSection }) {
  const items = [
    { id: "shoutouts", label: "Shoutouts" },
    { id: "leaderboard", label: "Leaderboard" },
    { id: "notifications", label: "Notifications" },
    { id: "performance", label: "Performance & Analytics" },
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
=======
import './EmpSidebar.css';

function EmpSidebar({ activeSection, setActiveSection }) {
  const items = [
    { id: "shoutouts", label: "Shoutouts" },
    { id: "leaderboard", label: "Leaderboard" },
    { id: "notifications", label: "Notifications" },
    { id: "performance", label: "Performance & Analytics" },
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
>>>>>>> 3e2424c214281832d92a15cbeb86496329d2c772
