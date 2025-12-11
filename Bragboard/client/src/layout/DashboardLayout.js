import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      background: "#f5f6fa",
      fontFamily: "Arial, sans-serif"
    }}>

      {/* Sidebar */}
      <aside style={{
        width: "220px",
        background: "#1e1e2f",
        color: "white",
        padding: "20px 15px"
      }}>
        <h2 style={{ marginBottom: "20px" }}>BragBoard</h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link style={linkStyle} to="/">🏠 Home</Link>
          <Link style={linkStyle} to="/login">🔐 Login</Link>
          <Link style={linkStyle} to="/signup">📝 Signup</Link>
        </nav>
      </aside>

      {/* Main container */}
      <main style={{
        flex: 1,
        padding: "30px"
      }}>
        {/* This loads nested pages */}
        <Outlet />

        {/* Default Home fallback if no nested route */}
        <div style={{ marginTop: "20px" }}>
          <h2>Welcome to BragBoard 🎉</h2>
          <p>This is the Internal Employee Recognition Dashboard.</p>
          <p>Post your achievements. Celebrate your coworkers.</p>
        </div>
      </main>
    </div>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  padding: "8px 10px",
  borderRadius: "6px",
  background: "#2f2f45",
};
