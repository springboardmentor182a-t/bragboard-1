import './EmpSidebar.css';

function EmpSidebar({ activeSection, setActiveSection }) {
  const items = [
     {id:"overview", label: "Overview"},
    { id: "shoutouts", label: "Shoutouts" },
    { id: "leaderboard", label: "Leaderboard" },
    { id: "notifications", label: "Notifications" },
    { id: "performance", label: "Performance & Analytics" },
    {id: 'reportingshoutouts', label: 'ReportingShoutouts'},
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

