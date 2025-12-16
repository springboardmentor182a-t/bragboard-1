
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../Common/Input";
import "../../styles/auth.css";
import { postJson } from "../../lib/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

 async function handleLogin(e) {
  e.preventDefault();
  setErr("");

  if (!email || !password) {
    setErr("Email and password are required.");
    return;
  }

  setLoading(true);
  try {
    
    const { status, data } = await postJson("/login/", {
      email,        // same fields you used in Swagger
      password,
    });

    if (status === 200) {
    console.log("Login success:", data);

  // store token
    if (data?.access_token) {
    localStorage.setItem("access_token", data.access_token);
    }

  // store role (optional but useful)
  if (data?.role) {
    localStorage.setItem("role", data.role);
  }

  // redirect based on role
  if (data.role === "admin") {
    navigate("/Admin", { replace: true });      // your admin dashboard route
  } else {
    navigate("/employee", { replace: true });   // your employee dashboard route
  }

  return;
}
 else if (status === 403 && data?.detail?.toLowerCase().includes("not verified")) {
      setErr("Account not verified. Please verify your email.");
      // optionally navigate("/verify-otp", { state: { email } });
    } 
    else if (
  status === 403 &&
  data?.detail?.toLowerCase().includes("pending admin approval")
) {
  // redirect to approval status page
  navigate("/ApprovalStatus", { replace: true });
}
else if (status === 401) {
      setErr("Invalid email or password.");
    }  else {
  // FastAPI 422: detail is usually an array of error objects
  let message = "Failed to send OTP.";

  if (Array.isArray(data?.detail) && data.detail.length > 0) {
    message = data.detail[0]?.msg || message;
  } else if (typeof data?.detail === "string") {
    message = data.detail;
  } else if (data?.message) {
    message = data.message;
  }

  setErr(message);
}
  } catch (err) {
    console.error(err);
    setErr("Network error — please try again.");
  } finally {
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

          

          {err && (
  <div className="error" role="alert">
    {String(err)}
  </div>
)}


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
