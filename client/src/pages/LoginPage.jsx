// src/pages/LoginPage.jsx

import { useState } from "react";

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder: just calls onLogin, no real auth
    if (onLogin) {
      onLogin({ username, role });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-purple-700">BragBoard Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-purple-200"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-purple-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="bg-purple-700 text-white px-4 py-2 rounded font-semibold hover:bg-purple-800"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
