import { useEffect, useState } from "react";
import axios from "axios";

function ApprovalRequests() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/admin/users/pending",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load pending approvals");
    }
  };

  const approveUser = async (id) => {
    await axios.post(
      `http://localhost:8000/admin/users/${id}/approve`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchPendingUsers();
  };

  const rejectUser = async (id) => {
    await axios.post(
      `http://localhost:8000/admin/users/${id}/reject`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchPendingUsers();
  };

  return (
    <div>
      <h2>Pending Employee Approvals</h2>

      {users.length === 0 ? (
        <p>No pending approvals</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.status}</td>
                <td>
  <div style={{ display: "flex", gap: "12px" }}>
    <button
      onClick={() => approveUser(u.id)}
      style={{
        padding: "6px 14px",
        background: "#16a34a",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      Approve
    </button>

    <button
      onClick={() => rejectUser(u.id)}
      style={{
        padding: "6px 14px",
        background: "#dc2626",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      Reject
    </button>
  </div>
</td>

              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ApprovalRequests;
