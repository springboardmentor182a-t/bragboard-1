
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../Common/Input";
import "../../styles/auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setErr("");
    if (!email || !password) { setErr("Email and password are required."); return; }
    setLoading(true);
    try {
      // If backend is available, call API here using your helper
      // Example: const { status, data } = await postJson("/api/auth/login", { email, password });
      // On success: navigate("/")
      // For now we'll simulate success
      setTimeout(() => {
        setLoading(false);
        navigate("/", { replace: true });
      }, 700);
    } catch (e) {
      console.error(e);
      setErr("Network error — try again.");
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <h2 className="big-title">Welcome Back.!</h2>
        
      </div>

      <div className="auth-card">
        <h2 className="auth-title">Login</h2>
        <p className="auth-sub">welcome back</p>

        <form className="auth-form" onSubmit={handleLogin}>
          <Input
            label=""
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Username"
            required
          />

          <Input
            label=""
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />

          

          {err && <div className="error" role="alert">{err}</div>}

          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Login"}
          </button>

          <div className="small-link">
            <a href="/forgot-password" style={{color:"var(--muted)"}}>Forgot password ?</a>
          </div>

          <div style={{height:18}}></div>

          <div style={{display:"flex", alignItems:"center", justifyContent:"center", gap:16}}>
            <div style={{flex:1, height:1, background:"rgba(255,255,255,0.06)"}}></div>
            <div style={{color:"var(--muted)"}}>Or</div>
            <div style={{flex:1, height:1, background:"rgba(255,255,255,0.06)"}}></div>
          </div>

          

          <div className="auth-footer">
            <div>Don't have an account ? <a href="/register">Signup</a></div>
            
          </div>

        </form>
      </div>
    </div>
  );
}
