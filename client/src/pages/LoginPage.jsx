<<<<<<< HEAD
// src/pages/LoginPage.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/login/", {
        email,
        password,
      });

      const { access_token, role, user_id } = res.data;

      // Store token in localStorage
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("role", role);
      localStorage.setItem("email", email);
      localStorage.setItem("user_id", user_id);

      if (onLogin) {
        onLogin({ email, role });
      }

      // Navigate based on role
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/employee");
      }
    } catch (err) {
      const message = err.response?.data?.detail || "Login failed";
      setError(message);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen bg-gray-100 items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-purple-700">BragBoard Login</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-purple-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-700 text-white px-4 py-2 rounded font-semibold hover:bg-purple-800 disabled:bg-gray-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
=======
// src/pages/LoginPage.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/login/", {
        email,
        password,
      });

      const { access_token, role, user_id } = res.data;

      // Store token in localStorage
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("role", role);
      localStorage.setItem("email", email);
      localStorage.setItem("user_id", user_id);

      if (onLogin) {
        onLogin({ email, role });
      }

      // Navigate based on role
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/employee");
      }
    } catch (err) {
      const message = err.response?.data?.detail || "Login failed";
      setError(message);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen bg-gray-100 items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-purple-700">BragBoard Login</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-purple-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-700 text-white px-4 py-2 rounded font-semibold hover:bg-purple-800 disabled:bg-gray-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
>>>>>>> 3e2424c214281832d92a15cbeb86496329d2c772
