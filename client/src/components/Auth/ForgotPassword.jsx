import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../Common/Input";
import "../../styles/auth.css";
import { postJson } from "../../lib/api";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);

    const { status, data } = await postJson("/forgot-password/", { email });

    // ✅ SUCCESS (FastAPI usually returns 200 or 201)
    if (status >= 200 && status < 300) {
      navigate("/reset-password", {
        state: {
          email,
          msg:
            data?.message ||
            "OTP sent to your email. Please check and continue.",
        },
      });
      return;
    }

    // ❌ ERROR handling
    let message = "Failed to send OTP.";

    if (Array.isArray(data?.detail) && data.detail.length > 0) {
      message = data.detail[0]?.msg || message;
    } else if (typeof data?.detail === "string") {
      message = data.detail;
    } else if (data?.message) {
      message = data.message;
    }

    setError(message);
    setLoading(false);
  }

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <h1 className="big-title">No Worries.!!</h1>
      </div>

      <div className="auth-card" style={{ minHeight: 540 }}>
        <h2 className="auth-title">Forgot Password?</h2>
        <p className="auth-sub">Please enter your email</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <Input
            name="email"
            type="email"
            placeholder="example@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {error && (
            <div className="error" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn primary"
            disabled={loading}
            style={{ marginTop: 12 }}
          >
            {loading ? "Sending…" : "Reset Password"}
          </button>

          <div style={{ flex: 1 }} />

          <div className="auth-footer" style={{ marginTop: 28 }}>
            <div>
              Don't have an account? <Link to="/register">Signup</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
