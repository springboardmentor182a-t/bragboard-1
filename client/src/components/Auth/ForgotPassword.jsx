
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../Common/Input";     // the reusable Input component you already added
import "../../styles/auth.css";         // shared styles used by Login/Signup

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMsg("");

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      // CALL BACKEND (uncomment & adapt when backend is available)
      // const { status, data } = await postJson("/api/auth/forgot", { email });
      // if (status === 200) { setMsg(data?.message || "If that account exists, a reset OTP was sent."); }

      // For now simulate success (remove simulated block when integrating real API)
      setTimeout(() => {
        setMsg("If that account exists, a reset code was sent to your email.");
        setLoading(false);
        
      }, 700);
    } catch (err) {
      console.error(err);
      setError("Network error — please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
     
      <div className="auth-hero">
        <h1 className="big-title">No Worries.!!</h1>
        
      </div>

      
      <div className="auth-card" style={{ minHeight: 540  }}>
        <h2 className="auth-title">Forgot Password ?</h2>
        <p className="auth-sub">Please enter your email</p>

        <form className="auth-form" onSubmit={handleSubmit} style={{ alignItems: "stretch" }}>
          <Input
            name="email"
            type="email"
            placeholder="example@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {error && <div className="error" role="alert">{error}</div>}
          {msg && <div className="success" role="status" style={{ color: "#d1ffd6" }}>{msg}</div>}

          <button
            type="submit"
            className="btn primary"
            style={{ marginTop: 12 }}
            disabled={loading}
          >
            {loading ? "Sending…" : "Reset Password"}
          </button>

        
          <div style={{ flex: 1 }}></div>

          <div className="auth-footer" style={{ marginTop: 28 }}>
            <div>Don't have an account ? <a href="/register">Signup</a></div>
            
          </div>
        </form>
      </div>
    </div>
  );
}
