import { Link } from "react-router-dom";
import "./Sidebar.css";
function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Employee<br />Dashboard</h2>
      <ul>
        <li><Link to="/">Overview</Link></li>
        <li><Link to="/tasks">Tasks & Projects</Link></li>
        <li><Link to="/shoutouts">Shoutouts</Link></li>
        <li><Link to="/attendance">Attendance & Leave</Link></li>
        <li><Link to="/leaderboard">Leaderboard</Link></li>
        <li><Link to="/notifications">Notifications</Link></li>
        <li><Link to="/profile">Profile & Documents</Link></li>
        <li><Link to="/performance">Performance & Analytics</Link></li>
        <li><Link to="/settings">Settings</Link></li>
      </ul>
    </div>
  );
}
export default Sidebar;
