import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Overview from "./components/Overview";
import Tasks from "./components/Tasks";
import Shoutouts from "./components/Shoutouts";
import Attendance from "./components/Attendance";
import Leaderboard from "./components/Leaderboard";
import Notifications from "./components/Notifications";
import Profile from "./components/Profile";
import Performance from "./components/Performance";
import Settings from "./components/Settings";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Header />
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/shoutouts" element={<Shoutouts />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
export default App;
