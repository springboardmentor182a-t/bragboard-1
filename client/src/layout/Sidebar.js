import React from 'react';
import { Link } from 'react-router-dom';

const sidebarStyle = {
  width: '200px',
  backgroundColor: '#343a40',
  color: 'white',
  padding: '20px',
  boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
};

const linkStyle = {
  display: 'block',
  color: 'white',
  textDecoration: 'none',
  padding: '10px 0',
  borderBottom: '1px solid #495057',
};

function Sidebar() {
  return (
    <div style={sidebarStyle}>
      <h3>Navigation</h3>
      <Link to="/" style={linkStyle}>
        🏠 Home
      </Link>
      <Link to="/reports" style={linkStyle}>
        🚨 Reported Shoutouts
      </Link>
      {/* Example for future links */}
      <Link to="/users" style={linkStyle}>
        👤 Manage Users
      </Link>
    </div>
  );
}

export default Sidebar;