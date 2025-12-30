import React, { useState } from "react";
import { postJson } from "../../lib/api";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/auth.css";

export default function ResetPassword() {
  const loc = useLocation();
  const navigate = useNavigate();
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

    if (!email) return setError("Please enter your email.");
    if (!otp) return setError("Please enter the OTP sent to your email.");
    if (!newPassword) return setError("Please enter a new password.");
    if (newPassword !== confirmPassword)
      return setError("Passwords do not match.");
    if (newPassword.length < 8)
      return setError("Password should be at least 8 characters.");
    if (newPassword.length > 50)
      return setError("Password must be at most 50 characters.");

    setLoading(true);
    try {
      const payload = { email, otp, new_password: newPassword };
      const { status, data } = await postJson("/reset-password/", payload);

      if (status === 200) {
        setMsg("Password reset successful. Redirecting to login...");
        setTimeout(() => navigate("/login", { replace: true }), 1200);
      } else {
        let message = "Failed to reset password.";

        if (Array.isArray(data?.detail) && data.detail.length > 0)
          message = data.detail[0]?.msg || message;
        else if (typeof data?.detail === "string") message = data.detail;
        else if (data?.message) message = data.message;

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
    <div
      className="auth-page"
      style={{
        minHeight: "100vh",
        background: "#050505",
        display: "flex",
        alignItems: "center",
        padding: "0 6vw",
      }}
    >
      {/* LEFT SIDE */}
      <div style={{ flex: 1, color: "#fff", paddingRight: "4rem" }}>
        <h1
          style={{
            fontSize: "4rem",
            lineHeight: 1.05,
            fontWeight: 700,
            marginBottom: "1.5rem",
          }}
        >
          No Worries.!!
        </h1>

        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            padding: "0.75rem 1.75rem",
            borderRadius: "999px",
            border: "2px solid #fff",
            background: "transparent",
            color: "#fff",
            fontWeight: 500,
            letterSpacing: "0.05em",
            cursor: "pointer",
          }}
        >
          Take me back.!
        </button>
      </div>

      {/* RIGHT SIDE CARD */}
      <div
        className="reset-card"
        style={{
          width: 420,
          maxWidth: "100%",
          background:
            "radial-gradient(circle at top left, rgba(255,20,147,0.25), transparent 55%), #101015",
          borderRadius: 24,
          padding: "32px 40px 36px",
          boxShadow: "0 0 40px rgba(0,0,0,0.6)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <h2
          style={{
            color: "#fff",
            fontSize: "1.6rem",
            marginBottom: 4,
            fontWeight: 600,
          }}
        >
          Reset Password ?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: 18 }}>
          Enter the OTP and your new password.
        </p>

        <form className="auth-form" onSubmit={handleReset}>
          <label className="field">
            <span className="label">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{ color: "#000", background: "#fff" }}
            />
          </label>

          <label className="field">
            <span className="label">OTP</span>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              required
              style={{ color: "#000", background: "#fff" }}
            />
          </label>

          <label className="field">
            <span className="label">New password</span>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Create a new password"
              required
              style={{ color: "#000", background: "#fff" }}
            />
          </label>

          <label className="field">
            <span className="label">Confirm password</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              style={{ color: "#000", background: "#fff" }}
            />
          </label>

          {error && (
            <div className="error" role="alert">
              {String(error)}
            </div>
          )}

          {msg && (
            <div className="success" role="status">
              {msg}
            </div>
          )}

          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? "Resetting…" : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
