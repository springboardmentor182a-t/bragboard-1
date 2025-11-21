import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmpDashboard";

function App() {
  const [user, setUser] = useState(null);

  // onLogin sets user info and role
  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  return (
    <>
      {user.role === "admin" && <AdminDashboard userName={user.username} />}
      {user.role === "employee" && <EmployeeDashboard userName={user.username} />}
    </>
  );
}
import React from "react";
import Shoutouts from "./pages/Shoutouts";

function App() {
  return <Shoutouts />;
}

export default App;
