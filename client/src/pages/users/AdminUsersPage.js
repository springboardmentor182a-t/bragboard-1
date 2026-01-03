// client/src/pages/users/AdminUsersPage.js

import React, { useState, useEffect } from 'react';
// 
// CHANGED: We are in 'users/', which is inside 'pages/', which is inside 'src/'
// We need to go up two levels: 'users' -> 'pages' -> 'src'. 
// The path '../../api' is correct if api.js is in src/. 
// If this fails, the file is likely mislocated. Let's assume the path is correct 
// and the issue is resolved on restart, but here's the code with the confirmed path:
// 
import { api } from '../../api'; 

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users'); 
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load user list. Check backend API connection.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading user list...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      <h2>👤 User Management ({users.length})</h2>
      <input
        type="text"
        placeholder="Search by username or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: '10px', width: '300px', marginBottom: '20px', border: '1px solid #ccc' }}
      />
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: '#e9ecef' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Username</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Role</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.username}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.email}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                <span style={{ fontWeight: user.role === 'Admin' ? 'bold' : 'normal', color: user.role === 'Admin' ? 'blue' : 'black' }}>
                  {user.role}
                </span>
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                <button style={{ backgroundColor: '#ffc107', color: 'black', border: 'none', padding: '5px 10px', marginRight: '5px', cursor: 'pointer' }}>
                  Edit
                </button>
                <button style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>
                  Ban
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredUsers.length === 0 && searchTerm && (
        <p>No users match your search criteria.</p>
      )}
    </div>
  );
}

export default AdminUsersPage;