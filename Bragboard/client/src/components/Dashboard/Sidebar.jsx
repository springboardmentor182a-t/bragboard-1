const Sidebar = ({ setActiveTab, activeTab }) => {
  return (
    <div className="sidebar">
      <h2>BRAG BOARD</h2>

      <ul>
        <li
          className={activeTab === "dashboard" ? "active" : ""}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </li>

        <li
          className={activeTab === "analytics" ? "active" : ""}
          onClick={() => setActiveTab("analytics")}
        >
          Reports – Analytics
        </li>

        <li
          className={activeTab === "trends" ? "active" : ""}
          onClick={() => setActiveTab("trends")}
        >
          Reports – Trends
        </li>

        <li>Settings</li>
      </ul>
    </div>
  );
};

export default Sidebar;
