import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../../services/authService";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      // change the route as per your app
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{maxWidth:400, margin:"40px auto", padding:20, border:"1px solid #eee", borderRadius:8}}>
      <h2>Sign in</h2>
      <form onSubmit={handleSubmit}>
        <div style={{marginBottom:10}}>
          <input
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            style={{width:"100%", padding:8}}
          />
        </div>
        <div style={{marginBottom:10}}>
          <input
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            style={{width:"100%", padding:8}}
          />
        </div>
        {error && <div style={{color:"red", marginBottom:10}}>{error}</div>}
        <button type="submit" disabled={loading} style={{width:"100%", padding:10}}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
