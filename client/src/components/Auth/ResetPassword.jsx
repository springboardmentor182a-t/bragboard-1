import React, { useState } from "react";
import { postJson } from "../../lib/api";
import { useLocation, useNavigate } from "react-router-dom";

import "../../styles/auth.css";

export default function ResetPassword() {
  const loc = useLocation();
  const navigate = useNavigate();
  // optionally prefills email if navigated from ForgotPassword using state
  const preEmail = (loc.state && loc.state.email) || "";

  const [email, setEmail] = useState(preEmail);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  async function handleReset(e) {
  e.preventDefault();
  setError("");
  setMsg("");

  if (!email) {
    setError("Please enter your email.");
    return;
  }
  if (!otp) {
    setError("Please enter the OTP sent to your email.");
    return;
  }
  if (!newPassword) {
    setError("Please enter a new password.");
    return;
  }
  if (newPassword !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }
  if (newPassword.length < 8) {
    setError("Password should be at least 8 characters.");
    return;
  }
  if (newPassword.length > 50) {
    setError("Password must be at most 50 characters.");
    return;
  }

  setLoading(true);
  try {
    const payload = {
      email,
      otp,
      new_password: newPassword, 
    };

    
    const { status, data } = await postJson("/auth/reset-password/", payload);

    if (status === 200) {
      setMsg("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/login", { replace: true }), 1200);
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

  setError(message);
}
  } catch (err) {
    console.error("Reset password error:", err);
    setError("Network error — please try again.");
  } finally {
    setLoading(false);
  }
}


  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Reset password</h1>
        <p className="auth-sub">Enter the OTP and your new password</p>

        <form className="auth-form" onSubmit={handleReset}>
          <label className="field">
            <span className="label">Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </label>

          <label className="field">
            <span className="label">OTP</span>
            <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123456" />
          </label>

          <label className="field">
            <span className="label">New password</span>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Create a new password" />
          </label>

          <label className="field">
            <span className="label">Confirm password</span>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" />
          </label>

          {error && (
  <div className="error" role="alert">
    {String(error)}
  </div>
)}

          {msg && <div className="success" role="status">{msg}</div>}

          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? "Resetting…" : "Reset password"}
          </button>
        </form>
      </div>
    </div>
  );
}
