import React from 'react';

const navbarStyle = {
  backgroundColor: '#007bff',
  color: 'white',
  padding: '15px 20px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  marginBottom: '10px'
};

function Navbar() {
  return (
    <div style={navbarStyle}>
      <h1>BragBoard Admin</h1>
    </div>
  );
}

export default Navbar;